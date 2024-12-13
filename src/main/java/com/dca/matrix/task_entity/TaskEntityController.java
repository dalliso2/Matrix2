package com.dca.matrix.task_entity;

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

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntitySearchMessage;
import com.dca.matrix.message.LongIdMessage;
import com.dca.matrix.task.Task;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/task_entity")
@RequiredArgsConstructor
public class TaskEntityController 
{
	private final TaskEntityService taskEntityService;
	
	@PostMapping(path = "/store")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<TaskEntity>> save(@RequestBody TaskEntityMessage taskEntityMessage, HttpServletRequest request)
	{	
		TaskEntity te = this.taskEntityService.save(taskEntityMessage);
		return new ResponseEntity<>(ApiResponseUtil.success(te, 
															"Saved task entity " + te.getId(), 
															request),HttpStatus.OK);
	}

	@PostMapping(path = "/delete")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<TaskEntity>> delete(@RequestBody LongIdMessage taskEntityId, HttpServletRequest request)
	{	
		return new ResponseEntity<>(ApiResponseUtil.success(this.taskEntityService.delete(taskEntityId.id()), 
															"Deleted task entity " + taskEntityId, 
															request),HttpStatus.OK);
	}

	@GetMapping(path = "/all_for_task/{taskId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<List<TaskEntity>>>> getAllForTask(@PathVariable("taskId") Long taskId, HttpServletRequest request)
	{
		List<List<TaskEntity>> taskEntities = this.taskEntityService.findAllForTaskId(taskId);
		return new ResponseEntity<>(ApiResponseUtil.success(taskEntities, "Retrieved task entities for task " + taskId, request), 
																HttpStatus.OK);
	}
	
	@GetMapping(path = "/all_for_entity/{entityId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<TaskEntity>>> getAllForEntity(@PathVariable("entityId") Long entityId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.taskEntityService.findAllForEntityId(entityId), 
															"Retrieved task entities for entity " + entityId,
															request), HttpStatus.OK);
	}
	
	@PostMapping("/search_unlinked_entities")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<List<MatrixEntity>>>> searchEntitiesNotLinked(@RequestBody TaskEntitySearchMessage searchMessage, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.taskEntityService.searchEntitiesNotLinked(searchMessage), 
															"Successfully loaded entities not linked to task.",
															request), HttpStatus.OK);
	}
}
