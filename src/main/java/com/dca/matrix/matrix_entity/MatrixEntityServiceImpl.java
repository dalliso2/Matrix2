package com.dca.matrix.matrix_entity;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.matrix_case.MatrixCaseRepository;
import com.dca.matrix.message.LongIdMessage;
import com.dca.matrix.message.LongIdsMessage;
import com.dca.matrix.property_value.PropertyValue;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MatrixEntityServiceImpl implements MatrixEntityService
{
	private final MatrixEntityRepository meRepository;
	private final EntityRelationshipRepository relationshipRepository;
	private final MatrixCaseRepository mcRepository;
	private final JdbcClient jdbcClient;

	//private final JdbcClient jdbcClient;

	@Override
	public List<List<MatrixEntity>> searchEntities(MatrixEntitySearchMessage searchMessage)
	{
		List<MatrixEntity> entityList = null;
		if (searchMessage.entityDefinitionIds().length > 0)
			entityList = this.meRepository.searchEntities(searchMessage.caseId(), searchMessage.entityDefinitionIds(), searchMessage.searchText());
		else
			entityList = this.meRepository.searchEntities(searchMessage.caseId(), searchMessage.searchText());

		return EntityUtils.groupEntitiesByEntityDefinition(entityList);
	}

	@Override
	@Transactional
	public EntityRelationship createRelationship(EntityRelationshipMessage message)
	{	
		MatrixEntity parent = this.meRepository.findById(message.parentId()).orElseThrow(()->
								new MatrixUncheckedException("Entity with id " + message.parentId() + " does not exist.",
																null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));
		
		MatrixEntity child = this.meRepository.findById(message.childId()).orElseThrow(()->
								new MatrixUncheckedException("Entity with id " + message.childId() + " does not exist.",
																null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));

//		if (Strings.isEmpty(message.parentChildRelationshipDescription()))
//			throw new MatrixUncheckedException(HttpStatus.BAD_REQUEST, 
//					"MatrixEntityService_createRelationship_102", 
//					"Parent/child relationship description not speciried.");
//
//		if (Strings.isEmpty(message.childParentRelationshipDescription()))
//			throw new MatrixUncheckedException(HttpStatus.BAD_REQUEST, 
//					"MatrixEntityService_createRelationship_102", 
//					"Child/parent relationship description not speciried.");					
		
		
		EntityRelationship parentChildRelationship = this.relationshipRepository.findByParentAndChild(message.parentId(), message.childId())
														.orElse(new EntityRelationship());
		parentChildRelationship.setParent(parent);
		parentChildRelationship.setChild(child);
		System.out.println(parentChildRelationship);
		parentChildRelationship.setDescription(message.parentChildRelationshipDescription());
		
		parentChildRelationship = this.relationshipRepository.save(parentChildRelationship);
		
		EntityRelationship childParentRelationship = this.relationshipRepository.findByParentAndChild(message.childId(), message.parentId())
														.orElse(new EntityRelationship());
		childParentRelationship.setParent(child);
		childParentRelationship.setChild(parent);
		System.out.println(childParentRelationship);
		childParentRelationship.setDescription(message.childParentRelationshipDescription());

		childParentRelationship = this.relationshipRepository.save(childParentRelationship);
		
		return parentChildRelationship;
	}

	@Override
	public List<EntityRelationshipProjection2> getRelatedEntities(Long parentId)
	{
		MatrixEntity parent = this.meRepository.findById(parentId).orElseThrow(()->
								new MatrixUncheckedException("Entity with id " + parentId + " does not exist.",
																null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));

//		List<EntityRelationship> relatedEntities = parent.getEntityRelationships();
//		relatedEntities.sort((x,y)->x.getChild().getEntityDefinition().getId().intValue() - 
//										y.getChild().getEntityDefinition().getId().intValue());
//		
//		relatedEntities.forEach(r->System.out.println(r));
		List<EntityRelationship> parentRelationships = this.relationshipRepository.getRelationships(parentId);
		
		// create list where parentId is the child
		List<EntityRelationship> childRelationships = new LinkedList<>(parentRelationships);
		childRelationships.removeIf(rel->rel.getParent().getId().equals(parentId));
		
		// remove relationships from parentRelationships where parentId is not the parent
		parentRelationships.removeIf(rel->!rel.getParent().getId().equals(parentId));
		
		List<EntityRelationshipProjection2> projections = 
				parentRelationships.stream().map(rel->new EntityRelationshipProjection2(rel.getId(), rel.getChild(), 
				rel.getDescription(),
				childRelationships.stream().filter(rel2->rel2.getParent().getId().equals(rel.getChild().getId())).findFirst().get().getDescription()))
				.toList();
		//childRelationships.stream().filter(rel2->rel2.getParent().getId().equals(parentId)).findFirst().get().getDescription()
		return projections;
	}

	@Override
	public List<List<MatrixEntity>> searchEntitiesNotLinked(MatrixEntitySearchMessage searchMessage)
	{
		List<MatrixEntity> entityList = null;
		if (searchMessage.entityDefinitionIds().length > 0)
			entityList = this.meRepository.searchEntitiesNotLinked(searchMessage.parentId(), searchMessage.caseId(), searchMessage.entityDefinitionIds(), searchMessage.searchText());
		else
			entityList = this.meRepository.searchEntitiesNotLinked(searchMessage.parentId(), searchMessage.caseId(), searchMessage.searchText());
		
		return EntityUtils.groupEntitiesByEntityDefinition(entityList);
	}

	@Override
	@Transactional
	public EntityRelationship removeRelationship(LongIdMessage idMessage)
	{
		EntityRelationship er1 = this.relationshipRepository.findById(idMessage.id()).orElseThrow(
				()->new MatrixUncheckedException("Entiyt relationship with id " + idMessage.id() + " does not exist.",
													null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));
		
		EntityRelationship er2 = this.relationshipRepository.findByParentAndChild(er1.getChild().getId(), er1.getParent().getId())
									.orElseThrow(()->new MatrixUncheckedException("Entity relationship with parent id " + er1.getChild().getId() 
													+ " and child id " + er1.getParent().getId()
													+ " does not exist.",
													null, ApiErrorCode.ENTITY_RELATIONSHIP_DOES_NOT_EXIST));
		
		this.relationshipRepository.delete(er1);
		this.relationshipRepository.delete(er2);
		return er1;
	}

	@Override
	public List<MatrixEntity> getAllForCase(Long caseId)
	{
//		MatrixCase theCase = this.mcRepository.findById(caseId).orElseThrow(
//				()->new MatrixUncheckedException(HttpStatus.BAD_REQUEST, 
//						"MatrixEntityService_getAllForCase_600", 
//						"MatrixCase with id " + caseId + " does not exist."));

		return this.meRepository.findAllByMatrixCase(caseId);
	}

	@Override
	public Collection<EntityRelationshipProjection> getCaseEntityRelationships(Long caseId)
	{
		String sql = """
                     select distinct er.parent_id, er.child_id, er.relationship_description 
                     from entity_relationship er, matrix_entity me 
                     where (er.parent_id = me.id 
                     or er.child_id = me.id) 
                     and me.matrix_case_id = ?
                    """;

		return this.jdbcClient.sql(sql).param(caseId)
							.query(new RowMapper<EntityRelationshipProjection>() 
									{
										@Override
										public EntityRelationshipProjection mapRow(ResultSet rs, int rowNum)
												throws SQLException
										{
											return new EntityRelationshipProjection(rs.getLong(1), rs.getLong(2), rs.getString(3));
										}
									}).list();
	}

	@Override
	public Collection<MatrixEntityProjection> getCaseEntityProjections(Long caseId)
	{
		String sql = """
                    select me.id, pd.id, pd.type, pd.name, pv.val, pd.include_in_title  
                    from matrix_entity me, property_value pv, property_definition pd, entity_definition ed
					where me.id = pv.entity_id 
						and me.entity_definition_id = ed.id
						and pd.id = pv.property_definition_id 
						and ed.include_in_link_chart = true
						and pv.property_definition_id = pd.id and me.matrix_case_id = ?
					order by me.id, pv.value_order
                    """;

		LinkedList<MatrixEntityProjection> entityProjections = new LinkedList<MatrixEntityProjection>();
		
		this.jdbcClient.sql(sql).param(caseId)
							.query((rs->{
								MatrixEntityProjection currentProj = null;
								if (entityProjections.size() > 0)
									currentProj = entityProjections.getLast();
								if (currentProj == null || !currentProj.getId().equals(rs.getLong(1)))
								{
									currentProj = new MatrixEntityProjection(rs.getLong(1));
									entityProjections.add(currentProj);
								}	
								currentProj.setProperty(rs.getLong(2), rs.getLong(3), rs.getString(4), rs.getString(5));
								if (rs.getBoolean(6))
									currentProj.addToTitle(rs.getString(5));
							}));
		
		return entityProjections;
	}
	
	@Override
	public Collection<MatrixEntity> getTimelineEntitiesForCase(Long caseId)
	{
		return this.meRepository.findAllTimelineEntities(caseId);
	}

	@Override
	@Transactional
	public MatrixEntity store(MatrixEntity entity)
	{
		// preserve create user/date for entity and property values
		if (!Objects.isNull(entity.getId()))
		{
			MatrixEntity existingEntity = this.meRepository.findById(entity.getId()).orElseThrow(
						()->new MatrixUncheckedException("Entiyt with id " + entity.getId() + " does not exist.",
															null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));
		
			entity.setCreatedBy(existingEntity.getCreatedBy());
			entity.setCreateTime(existingEntity.getCreateTime());
			entity.setMatrixCase(existingEntity.getMatrixCase());
			
			entity.getPropertyValues().forEach(propVal->{
				propVal.setMatrixEntity(entity);
				Iterator<PropertyValue> existingPropertyIterator = existingEntity.getPropertyValues().iterator();
				while (existingPropertyIterator.hasNext())
				{
					PropertyValue pv = existingPropertyIterator.next();
					if (Objects.equals(propVal.getId(), pv.getId()))
					{
						propVal.setCreatedBy(pv.getCreatedBy());
						propVal.setCreateTime(pv.getCreateTime());
						break;
					}
				}
			});
		}
		else
		{
			for (PropertyValue pv: entity.getPropertyValues())
				pv.setMatrixEntity(entity);
		}
		
		MatrixEntity e = this.meRepository.save(entity);

		return e;
	}

	@Override
	public MatrixEntity findById(Long matrixEntityId)
	{
		return this.meRepository.findById(matrixEntityId).get();
	}

	@Override
	public List<MatrixEntity> getAllLinkChartForCase(Long caseId)
	{
		return this.meRepository.findAllLinkChartEntitiesByCase(caseId);
	}

	@Override
	public Iterable<MatrixEntity> findByIds(LongIdsMessage matrixEntityIds)
	{
		Iterable<MatrixEntity> entities = this.meRepository.findAllById(matrixEntityIds.ids());
		// check and make sure all entities are from the correct case
		entities.forEach(entity->{
			if (!entity.getMatrixCase().getId().equals(matrixEntityIds.caseId()))
				throw new MatrixUncheckedException("Entity " + entity.getId() + " does not belong to case " + matrixEntityIds.caseId(),
								null, ApiErrorCode.INCORRECT_CASE_FOR_ENTITY);
		});
		return entities;
	}

	@Override
	public Collection<MatrixEntityTitleDTO> findMatrixEntityTitlesByCase(Long caseId)
	{
		String sql = """
			select pv.val from matrix_entity me, entity_definition ed, property_definition pd, property_value pv
			where me.entity_definition_id = ed.id
			and pd.entity_definition_id = ed.id
			and pv.property_definition_id = pd.id
			and pv.entity_id = me.id
			and pd.include_in_title = true
			and me.entity_definition_id in (select pd.entity_definition_id from property_definition pd where pd.include_in_timeline = true)
			order by me.id, pv.value_order
              """;

		LinkedList<MatrixEntityTitleDTO> entityProjections = new LinkedList<>();

		this.jdbcClient.sql(sql).param(caseId)
							.query((rs->{
								MatrixEntityTitleDTO dto = new MatrixEntityTitleDTO(rs.getLong(1), rs.getString(1));
								MatrixEntityTitleDTO lastDTO = entityProjections.getLast();
								if (dto.id().equals(lastDTO.id()))
								{
									entityProjections.removeLast();
									entityProjections.add(new MatrixEntityTitleDTO(dto.id(), lastDTO.title() + ", " + dto.title()));
								}
								else
									entityProjections.add(dto);
							}));
		
		return entityProjections;
	}
	
//	@Override
//	@Transactional
//	public MatrixEntity store(MatrixEntity entity)
//	{
//		// preserve create user/date for entity and property values
//		if (!Objects.isNull(entity.getId()))
//		{
//			MatrixEntity existingEntity = this.meRepository.findById(entity.getId()).orElseThrow(
//						()->new MatrixUncheckedException(HttpStatus.BAD_REQUEST, 
//						"MatrixEntityService_removeRelationship_600", 
//						"Entiyt with id " + entity.getId() + " does not exist."));
//		
//			entity.setCreatedBy(existingEntity.getCreatedBy());
//			entity.setCreateTime(existingEntity.getCreateTime());
//			entity.setMatrixCase(existingEntity.getMatrixCase());
//			
//			entity.getPropertyValues().forEach(propVal->{
//				propVal.setMatrixEntity(entity);
//				Iterator<PropertyValue> existingPropertyIterator = existingEntity.getPropertyValues().iterator();
//				while (existingPropertyIterator.hasNext())
//				{
//					PropertyValue pv = existingPropertyIterator.next();
//					if (Objects.equals(propVal.getId(), pv.getId()))
//					{
//						propVal.setCreatedBy(pv.getCreatedBy());
//						propVal.setCreateTime(pv.getCreateTime());
//						break;
//					}
//				}
//			});
//		}
//	
//		MatrixEntity e = this.meRepository.save(entity);
//
//		return e;
//	}
	
//	@Autowired
//	private EntityDefinitionRepository entityDefinitionRepository;
//	@Autowired
//	private MatrixEntityRepository matrixEntityRepository;
//	@Autowired
//	private EntityRelationshipRepository entityRelationshipRepository;
//	@Autowired
//	private PropertyDefinitionRepository propertyDefinitionRepository;
//	@Autowired
//	private PropertyRepository propertyRepository;
//	@Autowired
//	private PropertyValueRepository propertyValueRepository;
//	@Autowired
//	private ObjectMapper objectMapper;
//	
//	@Override
//	public MatrixEntity findById(Long id)
//	{
//		// TODO Auto-generated method stub
//		MatrixEntity me = this.matrixEntityRepository.findById(id).get();
//
//		List<EntityRelationship> relationships = this.entityRelationshipRepository.findByEntity1IdOrEntity2Id(me.getId(), me.getId());
//		
//		relationships.forEach((relationship) -> {
//			if (relationship.getEntity1Id().equals(me.getId()))
//				relationship.setEntity2(this.matrixEntityRepository.findById(relationship.getEntity2Id()).get());
//			else
//				relationship.setEntity1(this.matrixEntityRepository.findById(relationship.getEntity1Id()).get());
//		});
//		
//		relationships.sort((EntityRelationship relationship1, EntityRelationship relationship2) -> {
//			EntityBase entity1 = relationship1.getEntity1() == null? relationship1.getEntity2(): relationship1.getEntity1();
//			EntityBase entity2 = relationship2.getEntity1() == null? relationship2.getEntity2(): relationship2.getEntity1();
//	
//			return entity1.getEntityDefinition().getId().intValue() - entity2.getEntityDefinition().getId().intValue();
//		});
//		
//		me.setEntityRelationships(relationships);
//		return me;
//	}
//
//	@Override
//	public MatrixEntity save(Long entityDefinitionId, Long entityId, List<PropertyValueMessage> propertyValueMessages)
//	{
//		EntityDefinition entityDefinition = this.entityDefinitionRepository.findById(entityDefinitionId).get();
//		MatrixEntity tempEntity = null;
//
//		///////////////////////////
//		log.debug("Entity");
//		log.debug("entityDefinitionId: " + entityDefinitionId);
//		log.debug("entityId: " + entityId);
//		propertyValueMessages.forEach((msg) -> log.debug(msg.toString()));
//		
//		if (entityId != null)
//		{
//			tempEntity = this.matrixEntityRepository.findById(entityId).get();
//		}
//		else
//		{
//			tempEntity = new MatrixEntity();
//			tempEntity.setEntityDefinition(entityDefinition);
//			tempEntity = this.matrixEntityRepository.save(tempEntity);
//		}			
//		
//		final MatrixEntity constEntity = tempEntity;
//		
//		propertyValueMessages.forEach(propertyValueMessage ->
//		{
//			Optional<Property> opt = constEntity.findPropertyByPropertyDefinitionId(propertyValueMessage.getPropertyDefinitionId());
//			if (opt.isPresent())
//			{
//				Property prop = opt.get();
//				//Iterator<PropertyValue> propVals = prop.getValues().iterator();
//				//this.propertyValueRepository.deleteAll(prop.getValues());
//				prop.removeAllValues();
//				propertyValueMessage.getValue().forEach((val) -> prop.addValue(val));
//			}
//			else
//			{
//				PropertyDefinition propDef = this.propertyDefinitionRepository.findById(propertyValueMessage.getPropertyDefinitionId()).get();				
//				Property newProp = new Property();
//				newProp.setPropertyDefinition(propDef);
//				
//				propertyValueMessage.getValue().forEach(val -> newProp.addValue(val));
//				constEntity.addProperty(newProp);
//			}
//		});
//
//		log.debug("entityId: " + entityId);
//		propertyValueMessages.forEach((msg) -> log.debug(msg.toString()));
//
//		this.matrixEntityRepository.save(constEntity);
//		
//		return constEntity;
//	}
//
//	@Override
//	public List<MatrixEntity> searchEntities(EntitySearchMessage searchMessage)
//	{
//		log.debug("------------------------------------------------");
//		log.debug(searchMessage.toString());
//		List<MatrixEntity> me = null;
//			
//		String searchString = searchMessage.getSearchString();
//		Long entityDefinitionId = searchMessage.getEntityDefinitionId();
//		boolean searchStringExists = searchString != null && !searchString.isBlank();
//		
//		if (entityDefinitionId != null && searchStringExists)
//			me = this.matrixEntityRepository.searchEntities(entityDefinitionId, searchString);
//		else if (entityDefinitionId != null)
//			me = this.matrixEntityRepository.searchEntities(entityDefinitionId);
//		else if (searchStringExists)
//			me = this.matrixEntityRepository.searchEntities(searchString, new LinkedList<Long>());
//		
//		log.debug("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
//		me.forEach(entity -> {log.debug(entity.toString());} );
//		return me;
//	}
//
//	public List<MatrixEntity> searchEntitiesForRelationship(NewEntityRelationshipSearchMessage searchMessage)
//	{
//		log.debug("------------------------------------------------");
//		log.debug(searchMessage.toString());
//		List<MatrixEntity> me = null;
//			 
//		String searchString = searchMessage.getSearchString();
//		Long entityDefinitionId = searchMessage.getEntityDefinitionId();
//		Long parentEntityId = searchMessage.getParentEntityId();
//		
//		List<Long> dontShow = this.entityRelationshipRepository.getRelationshipEntityIds(parentEntityId);
//		dontShow.add(parentEntityId);
//		
//		log.debug("TTTTTTTTTTTTTTTTT");
//		log.debug(dontShow.toString());
//		//boolean searchStringExists = searchString != null && !searchString.isBlank();
//		
//		me = this.matrixEntityRepository.searchEntities(searchString, dontShow);
//		
//		log.debug("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
//		me.forEach(entity -> {log.debug(entity.toString());} );
//		return me;
//	}
//	
//	@Override
//	public EntityRelationship addRelationship(Long entity1Id, Long entity2Id, String entity1Entity2Description,
//			String entity2Entity1Description)
//	{	
//		EntityRelationship er1 = new EntityRelationship();
//		er1.setEntity1Id(entity1Id);
//		er1.setEntity2Id(entity2Id);
//		er1.setEntity1entity2Description(entity1Entity2Description);
//		er1.setEntity2entity1Description(entity2Entity1Description);
//		this.entityRelationshipRepository.save(er1);
//		
////		EntityRelationship er2 = new EntityRelationship();
////		er2.setParent(entity2);
////		er2.setChild(entity1);
////		er2.setDescription(entity2ToEntity1Description);
////		this.entityRelationshipRepository.save(er2);
//
//		return er1;
//	}

}
