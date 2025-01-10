package com.dca.matrix.entity_definition;

import java.util.Iterator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dca.matrix.property_definition.PropertyDefinition;
import com.dca.matrix.property_definition.PropertyDefinitionRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EntityDefinitionServiceImpl implements EntityDefinitionService
{
	private final EntityDefinitionRepository entityDefinitionRepository;
	
	@Override
	public List<EntityDefinition> getAll()
	{
		return this.entityDefinitionRepository.findAllByOrderByNameAsc();
	}

	@Override
	@Transactional
	public EntityDefinition storeEntityDefinition(EntityDefinition entityDefinition)
	{
		return this.entityDefinitionRepository.save(entityDefinition);
	}
	
	
}
