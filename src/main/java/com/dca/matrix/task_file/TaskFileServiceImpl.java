package com.dca.matrix.task_file;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.file.FileStorageService;
import com.dca.matrix.file.MFile;
import com.dca.matrix.file.MFileRepository;
import com.dca.matrix.matrix_entity.EntityUtils;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityRepository;
import com.dca.matrix.task.Task;
import com.dca.matrix.task.TaskRepository;
import com.dca.matrix.task.TaskService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskFileServiceImpl implements TaskFileService
{
	private final TaskFileRepository taskFileRepository;
	private final AuthorizationService authorizationService;
	private final TaskService taskService;
	private final FileStorageService fileStorageService;
	
	@Override
	public Collection<TaskFile> save(Collection<TaskFileMessage> msgs)
	{
		final List<TaskFile> returnVal = new LinkedList<>();
		msgs.forEach(msg->
		{
			final Task task = this.taskService.getTask(msg.taskId());
			final MFile file = this.fileStorageService.loadMFile(msg.fileId());

			// verify task and file are from same case
			if (!task.getMatrixCase().equals(file.getMatrixCase()))
				throw new MatrixValidationException("Task  " + msg.taskId() + " and file " + msg.fileId() + " are from different cases.",
														null, ApiErrorCode.VALIDATION_ERROR);
			
			this.authorizationService.verifyUserCanModify(task.getMatrixCase().getId());
			
			this.taskFileRepository.findByTaskAndMatrixFile(task, file)
				.ifPresentOrElse(tf->{
					tf.setDescription(msg.description());
					returnVal.add(this.taskFileRepository.save(tf));
				}, 
				()->returnVal.add(this.taskFileRepository.save(new TaskFile(task, file, msg.description()))));
		});

		return returnVal;
	}

	@Override
	public TaskFile delete(Long taskFileId)
	{
		TaskFile tf = this.taskFileRepository.findById(taskFileId).orElseThrow(
				()->new MatrixUncheckedException("TaskEntity with id " + taskFileId + " does not exist.",
													null, ApiErrorCode.TASK_DOES_NOT_EXIST));
		
		this.authorizationService.verifyUserCanModify(tf.getTask().getMatrixCase().getId());
		
		this.taskFileRepository.delete(tf);
		return tf;
	}

	@Override
	public List<MFile> searchFilesNotLinked(TaskFileSearchMessage searchMessage)
	{
		List<MFile> fileList = null;
		
		Task task = this.taskService.getTask(searchMessage.taskId());
		
		this.authorizationService.verifyUserCanModify(task.getMatrixCase().getId());
		
		if (Strings.isBlank(searchMessage.searchText()))
			fileList = this.taskFileRepository.searchFilesNotLinkedToTask(task.getId(),task.getMatrixCase().getId());
		else 
			fileList = this.taskFileRepository.searchFilesNotLinkedToTask( 	task.getId(),
					task.getMatrixCase().getId(),
					searchMessage.searchText());

		return fileList;
	}

	@Override
	public List<TaskFile> findAllForTaskId(Long taskId)
	{
		Task task = this.taskService.getTask(taskId);
		this.authorizationService.verifyUserCanView(task.getMatrixCase().getId());
		return this.taskFileRepository.findAllForTaskId(taskId);
	}
}
