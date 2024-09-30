package com.dca.matrix.task_entity;

import java.util.List;
import java.util.Optional;

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

@Service
@RequiredArgsConstructor
public class TaskEntityServiceImpl implements TaskEntityService
{
	private final TaskEntityRepository taskEntityRepository;
	private final TaskRepository taskRepository;
	private final MatrixEntityRepository meRepository;

	@Override
	public TaskEntity save(TaskEntityMessage msg)
	{
		Task task = this.taskRepository.findById(msg.taskId()).orElseThrow(
				()->new MatrixValidationException("Task with id " + msg.taskId() + " does not exist.",
													null, ApiErrorCode.TASK_DOES_NOT_EXIST));
		
		MatrixEntity entity = this.meRepository.findById(msg.entityId()).orElseThrow(
				()->new MatrixValidationException("Entity with id " + msg.entityId() + " does not exist.",
													null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));

		Optional<TaskEntity> teOpt = this.taskEntityRepository.findByMatrixEntityAndTask(entity, task);
		TaskEntity returnVal = null;
		
		if (teOpt.isPresent())
		{
			TaskEntity te = teOpt.get();
			te.setDescription(msg.description());
			returnVal = this.taskEntityRepository.save(te);
		}
		else
			returnVal = this.taskEntityRepository.save(new TaskEntity(task, entity, msg.description()));
		
		return returnVal;
	}

	@Override
	public TaskEntity delete(Long taskEntityId)
	{
		TaskEntity ef = this.taskEntityRepository.findById(taskEntityId).orElseThrow(
				()->new MatrixUncheckedException("TaskEntity with id " + taskEntityId + " does not exist.",
													null, ApiErrorCode.TASK_DOES_NOT_EXIST));
		
		this.taskEntityRepository.delete(ef);
		return ef;
	}

	@Override
	public List<List<MatrixEntity>> searchEntitiesNotLinked(TaskEntitySearchMessage searchMessage)
	{
		List<MatrixEntity> entityList = null;
		if (searchMessage.entityDefinitionIds().length > 0)
			entityList = this.taskEntityRepository.searchEntitiesNotLinkedToTask(searchMessage.taskId(), searchMessage.entityDefinitionIds(), searchMessage.searchText());
		else
			entityList = this.taskEntityRepository.searchEntitiesNotLinkedToTask(searchMessage.taskId(), searchMessage.searchText());

		return EntityUtils.groupEntitiesByEntityDefinition(entityList);
//		return EntityUtils.groupEntitiesByEntityDefinition(this.taskEntityRepository.a());
	}
	
	@Override
	public List<List<TaskEntity>> findAllForTaskId(Long taskId)
	{
		return TaskEntityUtils.groupTaskEntitiesByEntityDefinition(this.taskEntityRepository.findAllForTaskId(taskId));
	}
	
	@Override
	public List<TaskEntity> findAllForEntityId(Long entityId)
	{
		return this.taskEntityRepository.findAllForEntityId(entityId);
	}
	
}
