package com.dca.matrix.task_file;

import java.util.Collection;
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
import com.dca.matrix.file.MFile;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntitySearchMessage;
import com.dca.matrix.message.LongIdMessage;
import com.dca.matrix.task.Task;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path="/api/task_file", produces="application/json")
@RequiredArgsConstructor
@Slf4j
public class TaskFileController 
{
	private final TaskFileService taskFileService;
	
	@PostMapping(path = "/add")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Collection<TaskFile>>> save(@RequestBody Collection<TaskFileMessage> taskFileMessages, HttpServletRequest request)
	{	
		Collection<TaskFile> taskFiles = this.taskFileService.save(taskFileMessages);
		return new ResponseEntity<>(ApiResponseUtil.success(taskFiles, 
															"Saved task files.", 
															request.getRequestURI()),HttpStatus.OK);
	}

	@PostMapping(path = "/remove")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<TaskFile>> delete(@RequestBody LongIdMessage taskFileId, HttpServletRequest request)
	{	
		return new ResponseEntity<>(ApiResponseUtil.success(this.taskFileService.delete(taskFileId.id()), 
															"Deleted task file " + taskFileId, 
															request.getRequestURI()),HttpStatus.OK);
	}

	@GetMapping(path = "/all_for_task/{taskId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<TaskFile>>> getAllForTask(@PathVariable("taskId") Long taskId, HttpServletRequest request)
	{
		List<TaskFile> taskFiles = this.taskFileService.findAllForTaskId(taskId);
		return new ResponseEntity<>(ApiResponseUtil.success(taskFiles, "Retrieved task files for task " + taskId, request.getRequestURI()), 
																HttpStatus.OK);
	}
	
	@PostMapping(path="/search_unlinked_files")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<MFile>>> searchFilesNotLinked(@RequestBody TaskFileSearchMessage searchMessage, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.taskFileService.searchFilesNotLinked(searchMessage), 
				"Successfully loaded files not linked to task " + searchMessage.taskId(),
				request.getRequestURI()), HttpStatus.OK);
	}
}
