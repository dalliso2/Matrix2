package com.dca.matrix.matrix_case;

import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.user.UserCaseRecord;
import com.dca.matrix.user_case_role.UserCaseRole;
import com.dca.matrix.user_case_role.UserCaseRoleMessage;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/case")
@AllArgsConstructor
public class MatrixCaseController
{
	private final MatrixCaseService matrixCaseService;
	
	@PostMapping(path="/store", consumes="application/json")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<MatrixCase>> createCase(@Valid @RequestBody MatrixCase matrixCase, HttpServletRequest request)
	{
		MatrixCase updatedCase = this.matrixCaseService.createUpdateCase(matrixCase);
		return new ResponseEntity<>(ApiResponseUtil.success(updatedCase,
															"Successfully " + matrixCase.getId()!=null?"created":"updated" + " case " + updatedCase.getId(),
															request), HttpStatus.OK);
	}

	@GetMapping(path = "/{case_id}")
	public ResponseEntity<ApiResponse<MatrixCase>> getCase(@PathVariable("case_id") Long caseId, HttpServletRequest request)
	{
		MatrixCase mcase = this.matrixCaseService.getCase(caseId);
				
		return new ResponseEntity<>(ApiResponseUtil.success(mcase, "Loaded case " + mcase.getId(), request), HttpStatus.OK);
	}	
	
	@GetMapping(path = "/search")
	public ResponseEntity<ApiResponse<List<MatrixCase>>> search(@RequestParam String searchText, HttpServletRequest request)
	{
		List<MatrixCase> cases = this.matrixCaseService.search(searchText);
		return new ResponseEntity<>(ApiResponseUtil.success(cases, "Returned " + cases.size() + " cases.", request), HttpStatus.OK);
	}
	
	@GetMapping(path = "/users/{case_id}")
	public ResponseEntity<ApiResponse<List<CaseUserRecord>>> getCaseUsers(@PathVariable("case_id") Long caseId, HttpServletRequest request)
	{
		List<CaseUserRecord> ucrs = this.matrixCaseService.getUserList(caseId);
		
		return new ResponseEntity<>(ApiResponseUtil.success(ucrs, 
															ucrs.size() + " users found for case " + caseId, 
															request),
															HttpStatus.OK);
	}
	
	@PostMapping(path = "/users/add_update", consumes="application/json")
	public ResponseEntity<ApiResponse<UserCaseRole>> addUpdateUserToCase(@RequestBody UserCaseRoleMessage ucrMessage, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(
				this.matrixCaseService.addUpdateUserToCase(ucrMessage.userId(), ucrMessage.caseId(), ucrMessage.roleId()),
				"Successfully updated role of user " + ucrMessage.userId() + " to " + ucrMessage.roleId() + " for case " + ucrMessage.caseId(),
				request), HttpStatus.OK);
	}
	
	@DeleteMapping(path = "/users/remove", consumes="application/json")
	public ResponseEntity<ApiResponse<UserCaseRole>> removeUserFromCase(@RequestBody UserCaseRoleMessage ucrMessage, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(
				this.matrixCaseService.removeUser(ucrMessage.userId(), ucrMessage.caseId()),
				"Successfully updated role of user " + ucrMessage.userId() + " to " + ucrMessage.roleId() + " for case " + ucrMessage.caseId(),
				request), HttpStatus.OK);
	}
}
