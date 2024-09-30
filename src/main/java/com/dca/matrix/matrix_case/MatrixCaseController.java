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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/case")
@AllArgsConstructor
public class MatrixCaseController
{
	private final MatixCaseService matrixCaseService;
	
	@PostMapping(path="/store", consumes="application/json")
	@ResponseStatus(HttpStatus.OK)
	public MatrixCase createCase(@Valid @RequestBody MatrixCase matrixCase)
	{
		return this.matrixCaseService.createUpdateCase(matrixCase);
	}

	@GetMapping(path = "/{case_id}")
	@ResponseStatus(HttpStatus.OK)
	public MatrixCase getCase(@PathVariable("case_id") Long caseId)
	{
		return this.matrixCaseService.getCase(caseId);
	}	
	
	@GetMapping(path = "/users/{case_id}")
	@ResponseStatus(HttpStatus.OK)
	public List<CaseUserRecord> getCaseUsers(@PathVariable("case_id") Long caseId)
	{
		return this.matrixCaseService.getUserList(caseId);
	}
}
