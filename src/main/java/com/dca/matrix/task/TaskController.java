package com.dca.matrix.task;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.agency.AgencyDeserializer;
import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.matrix_case.MatrixCaseDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated")
@RequestMapping(path = "/api/task",produces = "application/json")
@RequiredArgsConstructor
public class TaskController
{
	private final TaskService taskService;
	
//////////////////////////////////////////////////////////////////////
//GET MAPPTINGS
//////////////////////////////////////////////////////////////////////

	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Task>> getTask(@PathVariable("id") Long id, HttpServletRequest request)
	{
		Task t = this.taskService.getTask(id);
		return new ResponseEntity<>(ApiResponseUtil.success(t, "Retrieved task " + t.getId(), request), HttpStatus.OK);
	}
	
//////////////////////////////////////////////////////////////////////
//POST MAPPTINGS
//////////////////////////////////////////////////////////////////////

	@PostMapping(path = "/store", consumes = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Task>> storeTask(@RequestBody Task task, HttpServletRequest request)
	{
		Task t = this.taskService.createUpdateTask(task);
		return new ResponseEntity<>(ApiResponseUtil.success(t, "Created task " + t.getId(), request),HttpStatus.OK);
	}

	@PostMapping(path = "/search", consumes = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Iterable<Task>>> queryTasks(@RequestBody TaskQueryParameters queryParameters, HttpServletRequest request)
	{
		ApiResponse<Iterable<Task>> response = ApiResponseUtil.success(this.taskService.searchTasks(queryParameters), "success", request);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}	
	
//	@PostMapping(path = "/search", consumes = "application/json")
//	@ResponseStatus(HttpStatus.OK)
//	public Iterable<Task> queryTasks(@RequestBody TaskQueryParameters queryParameters)
//	{
//		return this.taskService.searchTasks(queryParameters);
//	}	
}
