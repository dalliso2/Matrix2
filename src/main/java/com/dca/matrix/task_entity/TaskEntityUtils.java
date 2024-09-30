package com.dca.matrix.task_entity;

import java.util.LinkedList;
import java.util.List;

import com.dca.matrix.entity_definition.EntityDefinition;
import com.dca.matrix.matrix_entity.MatrixEntity;

public class TaskEntityUtils
{
	public static List<List<TaskEntity>> groupTaskEntitiesByEntityDefinition(List<TaskEntity> taskEntityList)
	{
		List<List<TaskEntity>> taskEntityListList = new LinkedList<>();
		EntityDefinition ed = null;
		List<TaskEntity> currentList = null;
		for (TaskEntity taskEntity: taskEntityList)
		{
			System.out.println("----------------------------");
			System.out.println("----------------------------");
			System.out.println("----------------------------");
			System.out.println("----------------------------");
			System.out.println(taskEntity);
			if (ed == null || !taskEntity.getMatrixEntity().getEntityDefinition().equals(ed))
			{
				ed = taskEntity.getMatrixEntity().getEntityDefinition();
				currentList = new LinkedList<TaskEntity>();
				taskEntityListList.add(currentList);
			}
			currentList.add(taskEntity);
		}
		
		return taskEntityListList;
	}
}
