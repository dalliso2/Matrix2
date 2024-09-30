package com.dca.matrix.task_file;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.file.MFile;
import com.dca.matrix.file.MFileRepository;
import com.dca.matrix.matrix_entity.EntityUtils;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityRepository;
import com.dca.matrix.task.Task;
import com.dca.matrix.task.TaskRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskFileServiceImpl implements TaskFileService
{
	private final TaskFileRepository taskFileRepository;
	private final TaskRepository taskRepository;
	private final MFileRepository mfRepository;

	@Override
	public Collection<TaskFile> save(Collection<TaskFileMessage> msgs)
	{
		List<TaskFile> returnVal = new LinkedList<>();
		msgs.forEach(msg->
		{
			Task task = this.taskRepository.findById(msg.taskId()).orElseThrow(
					()->new MatrixValidationException("Task with id " + msg.taskId() + " does not exist.",
														null, ApiErrorCode.TASK_DOES_NOT_EXIST));
			
			MFile file = this.mfRepository.findById(msg.fileId()).orElseThrow(
					()->new MatrixValidationException("File with id " + msg.fileId() + " does not exist.",
														null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));

			Optional<TaskFile> tfOpt = this.taskFileRepository.findByTaskAndMatrixFile(task, file);
			
			if (tfOpt.isPresent())
			{
				TaskFile tf = tfOpt.get();
				tf.setDescription(msg.description());
				returnVal.add(this.taskFileRepository.save(tf));
			}
			else
				returnVal.add(this.taskFileRepository.save(new TaskFile(task, file, msg.description())));
		});


		return returnVal;
	}

	@Override
	public TaskFile delete(Long taskFileId)
	{
		TaskFile tf = this.taskFileRepository.findById(taskFileId).orElseThrow(
				()->new MatrixUncheckedException("TaskEntity with id " + taskFileId + " does not exist.",
													null, ApiErrorCode.TASK_DOES_NOT_EXIST));
		
		this.taskFileRepository.delete(tf);
		return tf;
	}

	@Override
	public List<MFile> searchFilesNotLinked(TaskFileSearchMessage searchMessage)
	{
		List<MFile> fileList = null;
		
		Task task = this.taskRepository.findById(searchMessage.taskId()).orElseThrow(
				()->new MatrixUncheckedException("TaskEntity with id " + searchMessage.taskId() + " does not exist.",
						null, ApiErrorCode.TASK_DOES_NOT_EXIST));

		log.debug("CaseId: " + task.getMatrixCase().getId());
		if (Strings.isBlank(searchMessage.searchText()))
		{
			log.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
			log.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
			log.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
			log.debug("1");
			fileList = this.taskFileRepository.searchFilesNotLinkedToTask(task.getId(),task.getMatrixCase().getId());
		}
		else 
		{
			log.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
			log.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
			log.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
			log.debug("2");
			fileList = this.taskFileRepository.searchFilesNotLinkedToTask( 	task.getId(),
					task.getMatrixCase().getId(),
					searchMessage.searchText());
		}
		
		fileList.forEach(fl->log.debug(fl.toString()));
		log.debug(fileList.size() + " ");
		return fileList;
	}

	@Override
	public List<TaskFile> findAllForTaskId(Long taskId)
	{
		return this.taskFileRepository.findAllForTaskId(taskId);
	}
}
