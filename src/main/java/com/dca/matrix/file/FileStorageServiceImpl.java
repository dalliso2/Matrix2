package com.dca.matrix.file;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collection;
import java.util.LinkedList;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;
import com.dca.matrix.matrix_case.MatrixCaseService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FileStorageServiceImpl implements InitializingBean, FileStorageService
{
	@Value("${matrix.file_directory}")
	private String uploadDirectory;
	private Path root;
	private final MFileRepository mFileRepository;
	private final MatrixCaseService matrixCaseService;
	private final AuthorizationService authService;
	
/////////////// InitializingBean Methods /////////////////
	@Override
	public void afterPropertiesSet() throws Exception
	{		
		log.debug("afterPropertiesSet()");
		try
		{
			this.root = Path.of(uploadDirectory);
			Files.createDirectories(this.root);
			log.debug("afterPropertiesSet(): " + "successfully created directory " + this.root.toString());
		}
		catch (IOException ex)
		{
			log.error("afterPropertiesSet(): ERROR CREATING DIRECTORY " + root.toString());
			log.error(ex.getMessage(), ex);
		}
		log.debug("afterPropertiesSet(): end");
	}
	

	@Override
	public void init()
	{
	}

/////////////// FileStorageService Methods /////////////////

	@Override
	@Transactional
	public MFile saveFileInputStream(Optional<MatrixCase> caseOpt, InputStream fileInputStream, String originalFileName)
	{
		MFile newFile = null;
		MatrixCase mCase = null;
		
		try
		{
			newFile = new MFile(originalFileName);
			if (caseOpt.isPresent())
				newFile.setMatrixCase(caseOpt.get());
			this.mFileRepository.save(newFile);

			// save the file using name returned from the getServerFileName method
			// this method appends the id, before the extension, to the file name
			// this will prevent overwriting a file if users upload files with the 
			// same name
			Files.copy(fileInputStream, root.resolve(newFile.getServerFileName()));			
		}
		catch (Exception ex)
		{
			log.error(ex.getMessage(), ex);
		}
		
		return newFile;
	}
	
	@Override
	@Transactional
	public MFile save(Optional<MatrixCase> caseOpt, MultipartFile file)
	{
		MFile returnVal = null;
		try
		{
			returnVal = this.saveFileInputStream(caseOpt, file.getInputStream(), file.getOriginalFilename());
		}
		catch (IOException ex)
		{
			log.error(ex.getMessage());
			throw new MatrixUncheckedException("Error saving file + " + file.getOriginalFilename(), null, null);
		}
		return returnVal;
	}

	@Override
	public MFile loadMFile(Long id)
	{
		return this.mFileRepository.findById(id).orElseThrow(()->
												new MatrixValidationException("File with id " + id + " does not exist.",
														null, ApiErrorCode.FILE_DOES_NOT_EXIST));

	}
	
	@Override
	public Resource load(Long id)
	{
		log.debug("load(id): begin");

		Resource fileResource = null;
		
		try
		{
			log.debug("load(id): attempting to load file data from database");
			MFile mFile = this.loadMFile(id);
			
			MatrixCase mCase = mFile.getMatrixCase();
			if (mCase != null)
				this.authService.verifyUserCanView(mFile.getMatrixCase().getId());
			
			Path filePath = this.root.resolve(mFile.getServerFileName());
			log.debug("load(id): file path is " + filePath.toString());
			fileResource = new UrlResource(filePath.toUri());
			
			if (!fileResource.exists())
			{
				log.error("load(id): ERROR - " + filePath.toUri() + " DOES NOT EXIST");
				throw new RuntimeException("FileStorageServiceImpl:load(id): File " 
							+ fileResource.toString() + " does not exist.");
			}

			if (!fileResource.isReadable())
			{
				log.error("load(id): ERROR - " + filePath.toUri() + " CANNOT BE READ");
				throw new RuntimeException("FileStorageServiceImpl:load(id): File " 
							+ fileResource.toString() + " cannot be read.");
			}
			
			log.debug("load(id): file exists and is readable");
		}
		catch (MalformedURLException ex)
		{
			log.error("load(id): " + ex.getMessage());
			throw new RuntimeException(ex.getMessage());
		}
		
		return fileResource;
	}

	@Override 
	@Transactional
	public Collection<MFile> updateFiles(Collection<MFile> files)
	{
		files.forEach(file->
		{
			MFile mFile = this.mFileRepository.findById(file.getId()).orElseThrow(()->
						new MatrixValidationException("File with id " + file.getId() + " does not exist.",
								null, ApiErrorCode.FILE_DOES_NOT_EXIST));
			
			this.authService.verifyUserCanModify(mFile.getMatrixCase().getId());
			
			mFile.setName(file.getName());
			mFile.setDescription(file.getDescription());
			this.mFileRepository.save(mFile);
		});
		return files;
	}

	@Override
	public Collection<MFile> searchFilesNotLinkedToEntity(Long matrixEntityId, String searchString)
	{
		return this.mFileRepository.searchFilesNotLinkedToEntity(matrixEntityId, searchString);
	}


	@Override
	public Collection<MFile> storeFiles(Long caseId, MultipartFile[] files)
	{
		Collection<MFile> newFiles = new LinkedList<>();

		Optional<MatrixCase> caseOpt = this.matrixCaseService.getCaseOpt(caseId);
		
		// a user can only upload files for a case
		// an admin may also upload user pics that aren't associated with a case
		if (caseOpt.isPresent())
			this.authService.verifyUserCanModify(caseId);
		else
			this.authService.verifyUserIsSystemAdmin();

		try
		{
			Stream.of(files).forEach(file -> {
				newFiles.add(this.save(caseOpt, file));
			});
		}
		catch (Exception ex)
		{
			log.error("uploadFiles(files): FAILED TO SAVE FILES");
			log.error("uploadFiles(files): " + ex.getMessage());
			throw new MatrixValidationException("Error saving file:  " + ex.getLocalizedMessage(), null,
					ApiErrorCode.ERROR_UPLOADING_FILE);
		}

		return newFiles;
	}
}
