package com.dca.matrix.file;

import java.time.Duration;
import java.util.Collection;
import java.util.LinkedList;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.authentication.JWTTokenService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path = "/api/file", produces = "application/json")
public class FileController
{
	private final MatrixUserRepository	matrixUserRepository;
	private final FileStorageService	storageService;
	private final JWTTokenService		tokenService;
	private final MFileRepository		mFileRepository;
	
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Collection<MFile> uploadFiles(@RequestParam Long matrixCaseId,
			@RequestParam("files") MultipartFile[] files, HttpServletRequest request)
	{
//		Collection<MFile> newFiles = new LinkedList<>();
//		log.debug("uploadFiles(files): begin");
//		try
//		{
//			Stream.of(files).forEach(file -> {
//				log.debug("uploadFiles(files): saving file " + file.toString());
//				newFiles.add(this.storageService.save(matrixCaseId, file));
//			});
//		}
//		catch (Exception ex)
//		{
//			log.error("uploadFiles(files): FAILED TO SAVE FILES");
//			log.error("uploadFiles(files): " + ex.getMessage());
//			throw new MatrixValidationException("Error saving file:  " + ex.getLocalizedMessage(), null,
//					ApiErrorCode.ERROR_UPLOADING_FILE);
//		}
//
//		log.debug("uploadFiles(files): end");
//
//		return newFiles;
		// return newFiles;
//		return new ResponseEntity<>(ApiResponseUtil.success(this.storageService.storeFiles(matrixCaseId, files), 
//														"Successfully updated files.", request),
//														HttpStatus.OK);
		return this.storageService.storeFiles(matrixCaseId, files);
	}

	@PostMapping(value = "/update_files", consumes = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Collection<MFile>>> updateFiles(@RequestBody Collection<MFile> files,
			HttpServletRequest request)
	{
		return new ResponseEntity<>(
				ApiResponseUtil.success(this.storageService.updateFiles(files), "Successfully updated files.", request),
				HttpStatus.OK);
	}

	// This URI does not go through the authentication filter because the
	// authentication token
	// may not be present in the header. The parameter t will hold the
	// authentication token
	// This method must authenticate and authorize the user for the requested
	// resource
	@GetMapping(value = "/{id}", produces = MediaType.ALL_VALUE)
	public ResponseEntity<byte[]> getFile(@PathVariable("id") Long id, @RequestParam Map<String, String> params)
	{
//		// make sure file exists
//		MFile mFile = this.mFileRepository.findById(id)
//				.orElseThrow(() -> new MatrixUncheckedException("File with id " + id + " does not exist.", null,
//						ApiErrorCode.FILE_DOES_NOT_EXIST));

//		log.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//		log.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//		log.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//		log.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//		log.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//		log.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//		Optional<String> tokenOpt = Optional.ofNullable(params.get("t"));
//		log.debug(tokenOpt.get());
//		if (tokenOpt.isEmpty())
//			throw new AccessDeniedException("Access token not found in request.");
//
//		String username = this.tokenService.validateTokenReturnUsername(tokenOpt.get());
//		if (Strings.isBlank(username))
//			throw new AccessDeniedException("Invalid authentication token.");
//
//		log.debug(username);
//		MatrixUser tokenUser = this.matrixUserRepository.findByUsername(username).orElseThrow(
//				()->new AccessDeniedException("Invalid authentication token."));
//
//		// make sure the current user has access to view this case
//		if (mFile.getMatrixCase() != null)
//			tokenUser.canModify(mFile.getMatrixCase());

		HttpHeaders headers = new HttpHeaders();
		headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(365)));
		return new ResponseEntity(this.storageService.load(id), headers, HttpStatus.OK);
	}

	@GetMapping(value = "/search_not_linked_to_entity")
	public ResponseEntity<ApiResponse<Collection<MFile>>> searchFilesNotLinkedToEntity(
			@RequestParam("entity_id") Long entityId, @RequestParam("search_string") String searchString,
			HttpServletRequest request)
	{
		return new ResponseEntity<>(
				ApiResponseUtil.success(this.storageService.searchFilesNotLinkedToEntity(entityId, searchString),
						"Search files not linked to entity completed successfully.", request),
				HttpStatus.OK);
	}

}
