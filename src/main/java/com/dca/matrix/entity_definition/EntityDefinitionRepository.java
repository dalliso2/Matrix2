package com.dca.matrix.entity_definition;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface EntityDefinitionRepository extends CrudRepository<EntityDefinition, Long>
{
	List<EntityDefinition> findAllByOrderByNameAsc();
}
