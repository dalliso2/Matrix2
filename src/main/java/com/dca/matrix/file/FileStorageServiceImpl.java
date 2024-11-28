package com.dca.matrix.file;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements InitializingBean, FileStorageService
{
	@Value("${matrix.file_directory}")
	private String uploadDirectory;
	private Path root;
	private final MFileRepository mFileRepository;
	private final MatrixCaseRepository matrixCaseRepository;
	
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
	public MFile save(Optional<Long> caseId, MultipartFile file)
	{
		MFile newFile = null;
		log.debug("save(file): begin");

		MatrixCase mCase = null;
		
		if (caseId.isPresent())
			mCase = this.matrixCaseRepository.findById(caseId.get()).orElseThrow(()->		
								new MatrixValidationException("Case with id " + caseId + " does not exist.",
										null, ApiErrorCode.CASE_DOES_NOT_EXIST));
		
		try
		{
			String originalFileName = file.getOriginalFilename();
			log.debug("save(file): originalFileName: " + originalFileName);
			
			// save the file so that it will have an id
			newFile = new MFile(originalFileName);
			newFile.setMatrixCase(mCase);
			log.debug("save(file): attempting to save file info in database");
			this.mFileRepository.save(newFile);
			log.debug("save(file): successfully saved file in database");
			
			// save the file using name returned from the getServerFileName method
			// this method appends the id, before the extension, to the file name
			// this will prevent overwriting a file if users upload files with the 
			// same name
			log.debug("save(file): attempting to save file in file system");
			Files.copy(file.getInputStream(), root.resolve(newFile.getServerFileName()));
			log.debug("save(file): successfully saved file in file system");
		}
		catch (Exception ex)
		{
			log.error("ERROR SAVING FILE");
			log.error(ex.getMessage(), ex);
		}
		
		return newFile;
	}

	@Override
	public Resource load(Long id)
	{
		log.debug("load(id): begin");

		Resource fileResource = null;
		
		try
		{
			log.debug("load(id): attempting to load file data from database");
			MFile mFile = this.mFileRepository.findById(id).get();
			
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
}
