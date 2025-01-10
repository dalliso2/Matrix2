package com.dca.matrix.entity_definition;

import java.util.List;

public interface EntityDefinitionService
{
	List<EntityDefinition> getAll();
	EntityDefinition storeEntityDefinition(EntityDefinition entityDef);
}
