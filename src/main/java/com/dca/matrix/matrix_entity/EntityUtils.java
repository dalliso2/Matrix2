package com.dca.matrix.matrix_entity;

import java.util.LinkedList;
import java.util.List;

import com.dca.matrix.entity_definition.EntityDefinition;

public class EntityUtils
{
	// expects that the list passed in will be sorted by entity definition
	public static List<List<MatrixEntity>> groupEntitiesByEntityDefinition(List<MatrixEntity> entityList)
	{
		List<List<MatrixEntity>> entityListList = new LinkedList<>();
		EntityDefinition ed = null;
		List<MatrixEntity> currentList = null;
		for (MatrixEntity entity: entityList)
		{
			if (ed == null || !entity.getEntityDefinition().equals(ed))
			{
				ed = entity.getEntityDefinition();
				currentList = new LinkedList<MatrixEntity>();
				entityListList.add(currentList);
			}
			currentList.add(entity);
		}
		
		return entityListList;
	}
}
