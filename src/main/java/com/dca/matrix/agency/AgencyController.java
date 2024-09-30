package com.dca.matrix.agency;

import java.util.List;

import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.user.AuthenticationService;
import com.dca.matrix.user.MatrixUserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/agency",produces="application/json")
@RequiredArgsConstructor
public class AgencyController
{
	private final AgencyService agencyService;
	
	@PostMapping(path = "/store", consumes = "application/json")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Agency>> createAgency(@RequestBody Agency agency, HttpServletRequest request)
	{
		return	new ResponseEntity<>(ApiResponseUtil.success(this.agencyService.createUpdateAgency(agency), 
										"Successfully created agency", 
										request.getRequestURI()), HttpStatus.OK);
	}
	
	@PutMapping(path = "/store", consumes = "application/json")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Agency>> storeAgency(@RequestBody Agency agency, HttpServletRequest request)
	{
		return	new ResponseEntity<>(ApiResponseUtil.success(this.agencyService.createUpdateAgency(agency), 
										"Successfully updated agency", 
										request.getRequestURI()), HttpStatus.CREATED);
	}
	
	@DeleteMapping(path = "/delete/{agencyId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Agency>> deleteAgency(@PathVariable("agencyId") Long agencyId, HttpServletRequest request)
	{
		return	new ResponseEntity<>(ApiResponseUtil.success(this.agencyService.deleteAgency(agencyId), 
										"Successfully removed agency", 
										request.getRequestURI()), HttpStatus.OK);
	}
	
	@GetMapping(path = "/all")
	public ResponseEntity<ApiResponse<List<Agency>>> getAllAgencies(HttpServletRequest request)
	{
		return	new ResponseEntity<>(ApiResponseUtil.success(this.agencyService.getAgencyList(), 
										"Successfully retrieved all agencies.", 
										request.getRequestURI()), HttpStatus.OK);
	}
	
	@GetMapping(path = "/{agencyId}")
	public ResponseEntity<ApiResponse<Agency>> getAgency(@PathVariable("agencyId") Long agencyId, HttpServletRequest request)
	{
		return	new ResponseEntity<>(ApiResponseUtil.success(this.agencyService.getAgency(agencyId), 
										"Successfully retrieved all agencies.", 
										request.getRequestURI()), HttpStatus.OK);
	}
}
