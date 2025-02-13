package com.dca.matrix.entity_file;

import java.util.Collection;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.message.LongIdMessage;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/entity_file")
@RequiredArgsConstructor
public class EntityFileController 
{
	private final EntityFileService entityFileService;
	
	@PostMapping(path = "/add")
	public ResponseEntity<ApiResponse<Collection<EntityFile>>> save(@RequestBody Collection<EntityFile> entityFiles, HttpServletRequest request)
	{	
		return	new ResponseEntity<>(ApiResponseUtil.success(this.entityFileService.save(entityFiles), 
				"Successfully created entity file(s).", 
				request), HttpStatus.OK);
	}

	@DeleteMapping(path = "/remove")
	public ResponseEntity<ApiResponse<EntityFile>> remove(@RequestBody LongIdMessage entityFileIdMessage, HttpServletRequest request)
	{	
		return	new ResponseEntity<>(ApiResponseUtil.success(this.entityFileService.remove(entityFileIdMessage.id()), 
				"Successfully removed entity file(s).", 
				request), HttpStatus.OK);
	}

	@GetMapping(path = "/all_for_entity/{entityId}")
	public ResponseEntity<ApiResponse<List<EntityFile>>> getForEntity(@PathVariable("entityId") Long entityId, HttpServletRequest request)
	{
		return	new ResponseEntity<>(ApiResponseUtil.success(this.entityFileService.findForEntity(entityId), 
				"Successfully retrieved entity file(s) for entity with id " + entityId, 
				request), HttpStatus.OK);
	}
}
