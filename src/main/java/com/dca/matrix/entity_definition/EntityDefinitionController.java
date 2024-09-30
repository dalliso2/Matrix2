package com.dca.matrix.entity_definition;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/entity_definition")
@RequiredArgsConstructor
public class EntityDefinitionController
{
	private final EntityDefinitionService entityDefinitionService;
	
	@GetMapping(path = "/all")
	public ResponseEntity<ApiResponse<List<EntityDefinition>>> getAll(HttpServletRequest request) throws Exception
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.entityDefinitionService.getAll(), 
															"Entity definition list",
															request.getRequestURI()), 
															HttpStatus.OK);
	}	
	
	@PostMapping(path = "/store")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<EntityDefinition>> create(@RequestBody EntityDefinition entityDefinition, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.entityDefinitionService.createUpdateEntityDefinition(entityDefinition), 
									"Created entity definition.",
									request.getRequestURI()), 
									HttpStatus.OK);
	}
}
