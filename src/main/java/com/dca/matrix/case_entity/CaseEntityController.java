package com.dca.matrix.case_entity;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/case_entity")
@RequiredArgsConstructor
public class CaseEntityController 
{
//	private final CaseEntityService caseEntityService;
//	
//	@PostMapping(path = "/add", consumes = "application/json")
//	@ResponseStatus(HttpStatus.CREATED)
//	public ResponseEntity<ApiResponse<CaseEntity>> save(@RequestBody CaseEntity caseEntity, HttpServletRequest request)
//	{	
//		return new ResponseEntity<>(ApiResponseUtil.success(this.caseEntityService.addCaseEntity(caseEntity),
//										"Successfully created case-entity.",
//										request), HttpStatus.CREATED);
//	}

}
