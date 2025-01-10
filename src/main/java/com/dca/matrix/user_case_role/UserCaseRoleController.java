package com.dca.matrix.user_case_role;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.matrix_case.MatrixCaseService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/ucr")
@AllArgsConstructor
public class UserCaseRoleController
{
//	private final UserCaseRoleService ucrService;
//	
//	@PostMapping(path = "/store", consumes = "application/json")
//	@ResponseStatus(HttpStatus.OK)
//	public ResponseEntity<ApiResponse<UserCaseRoleMessage>> storeUserCaseRole(@Valid @RequestBody UserCaseRoleMessage ucrMessage, HttpServletRequest request)
//	{
//		//return this.ucrService.storeUserCaseRole(ucrMessage);
//		return	new ResponseEntity<>(ApiResponseUtil.success(new UserCaseRoleMessage(this.ucrService.storeUserCaseRole(ucrMessage)), 
//				"Successfully retrieved all agencies.", 
//				request), HttpStatus.OK);
//
//	}
//	
//	@DeleteMapping(path = "/delete", consumes = "application/json")
//	@ResponseStatus(HttpStatus.OK)
//	public ResponseEntity<ApiResponse<UserCaseRole>> deleteUserCaseRole(@Valid @RequestBody UserCaseRoleMessage ucrMessage, HttpServletRequest request)
//	{
//		//return this.ucrService.deleteUserCaseRole(ucrMessage);
//		return	new ResponseEntity<>(ApiResponseUtil.success(this.ucrService.deleteUserCaseRole(ucrMessage), 
//				"Successfully removed user " + ucrMessage.userId() + " from case " + ucrMessage.caseId(), 
//				request), HttpStatus.OK);
//
//	}
	
//	@PostMapping(path = "/set_owner")
//	@PreAuthorize("hasRole('ADMIN')")
//	public ResponseEntity<ApiResponse<UserCaseRole>> setCaseOwner(@RequestBody UserCaseRoleMessage ucrMessage, HttpServletRequest request)
//	{
//		return new ResponseEntity<>(ApiResponseUtil.success(this.ucrService.setCaseOwner(ucrMessage), null, HttpStatus.OK))
//	}
}
