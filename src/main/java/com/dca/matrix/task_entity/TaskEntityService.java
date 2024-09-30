package com.dca.matrix.task_entity;

import java.util.List;

import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.task.Task;

public interface TaskEntityService
{
	TaskEntity save(TaskEntityMessage taskEntityMessage);
	TaskEntity delete(Long taskEntityId);
	List<List<TaskEntity>> findAllForTaskId(Long taskId);
	List<TaskEntity> findAllForEntityId(Long entityId);
	List<List<MatrixEntity>> searchEntitiesNotLinked(TaskEntitySearchMessage searchMessage);
}
