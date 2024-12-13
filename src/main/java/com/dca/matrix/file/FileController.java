	package com.dca.matrix.file;

import java.time.Duration;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.authentication.JWTTokenService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.task_file.TaskFileSearchMessage;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping(path = "/api/file", produces="application/json")
public class FileController
{
	private final FileStorageService storageService;
	private final JWTTokenService tokenService;
	
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Collection<MFile> uploadFiles(@RequestParam Optional<Long> matrixCaseId, 
																	@RequestParam("files") MultipartFile[] files,
																	HttpServletRequest request)
	{
		Collection<MFile> newFiles = new LinkedList<>();
		log.debug("uploadFiles(files): begin");
		try
		{
			Stream.of(files).forEach(file -> {
				log.debug("uploadFiles(files): saving file " + file.toString());
				newFiles.add(this.storageService.save(matrixCaseId, file));
			});
		}
		catch (Exception ex)
		{
			log.error("uploadFiles(files): FAILED TO SAVE FILES");
			log.error("uploadFiles(files): " + ex.getMessage());
			throw new MatrixValidationException("Error saving file:  " + ex.getLocalizedMessage(),
					null, ApiErrorCode.ERROR_UPLOADING_FILE);
		}
		
		log.debug("uploadFiles(files): end");
		
		return newFiles;
		//return newFiles;
	}
	
	@PostMapping(value="/update_files", consumes = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Collection<MFile>>> updateFiles(@RequestBody Collection<MFile> files, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.storageService.updateFiles(files), "Successfully updated files.", request), HttpStatus.OK);
		//return this.storageService.updateFiles(files);
	}
	
	@GetMapping(value="/{id}", produces=MediaType.ALL_VALUE)
	public ResponseEntity<byte[]> getFile(@PathVariable("id") Long id, @RequestParam Map<String,String> params)
	{
		try
		{
			String token = params.get("t");
			String username = this.tokenService.validateTokenReturnUsername(token);
			log.debug("USERNAME: " + username);
			// TODO check is user has access to this file 
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_JPEG);
			headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(365)));
			return new ResponseEntity(this.storageService.load(id), headers, HttpStatus.OK);
		}
		catch (JWTVerificationException ex)
		{
			throw new MatrixUncheckedException("Invalid credentials",null, ApiErrorCode.NOT_AUTHORIZED);
		}
		catch (Exception ex)
		{				
			log.error("FileController:getFile(id): " + ex.getMessage());
			
			throw new MatrixUncheckedException("Unable to retrieve file with id " + id, null, ApiErrorCode.ERROR_RETRIEVEING_FILE);
		}
	}
	
	@GetMapping(value="/search_not_linked_to_entity")
	public ResponseEntity<ApiResponse<Collection<MFile>>> searchFilesNotLinkedToEntity(@RequestParam("entity_id") Long entityId, 
															@RequestParam("search_string") String searchString,
															HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.storageService.searchFilesNotLinkedToEntity(entityId, searchString),
														"Search files not linked to entity completed successfully.",
														request),
														HttpStatus.OK);
	}
	
}
