package com.dca.matrix.task_entity;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.matrix_entity.EntityUtils;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityService;
import com.dca.matrix.task.Task;
import com.dca.matrix.task.TaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskEntityServiceImpl implements TaskEntityService
{
	private final TaskEntityRepository taskEntityRepository;
	private final AuthorizationService authorizationService;
	private final TaskService taskService;
	private final MatrixEntityService meService;

	@Override
	public TaskEntity save(TaskEntityMessage msg)
	{
		Task task = this.taskService.getTask(msg.taskId());
		
		MatrixEntity entity = this.meService.findById(msg.entityId());

		// verify task and entity are from same case
		if (!task.getMatrixCase().equals(entity.getMatrixCase()))
			throw new MatrixValidationException("Entity  " + msg.entityId() + " and task " + task.getId() + " are from different cases.",
					null, ApiErrorCode.VALIDATION_ERROR);
			
		this.authorizationService.verifyUserCanModify(task.getMatrixCase().getId());	
					
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
		
		this.authorizationService.verifyUserCanModify(ef.getTask().getMatrixCase().getId());
		
		this.taskEntityRepository.delete(ef);
		return ef;
	}

	@Override
	public List<List<MatrixEntity>> searchEntitiesNotLinked(TaskEntitySearchMessage searchMessage)
	{
		this.authorizationService.verifyUserCanModify(searchMessage.caseId());
		
		List<MatrixEntity> entityList = null;
		if (searchMessage.entityDefinitionIds().length > 0)
			entityList = this.taskEntityRepository.searchEntitiesNotLinkedToTask(searchMessage.taskId(), searchMessage.entityDefinitionIds(), searchMessage.searchText());
		else
			entityList = this.taskEntityRepository.searchEntitiesNotLinkedToTask(searchMessage.taskId(), searchMessage.searchText());

		return EntityUtils.groupEntitiesByEntityDefinition(entityList);
	}
	
	@Override
	public List<List<TaskEntity>> findAllForTaskId(Long taskId)
	{
		this.authorizationService.verifyUserCanView(this.taskService.getTask(taskId).getMatrixCase().getId());
		return TaskEntityUtils.groupTaskEntitiesByEntityDefinition(this.taskEntityRepository.findAllForTaskId(taskId));
	}
	
	@Override
	public List<TaskEntity> findAllForEntityId(Long entityId)
	{
		this.authorizationService.verifyUserCanView(meService.findById(entityId).getMatrixCase().getId());
		return this.taskEntityRepository.findAllForEntityId(entityId);
	}
	
}
