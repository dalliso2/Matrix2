package com.dca.matrix.matrix_entity;

import java.util.Collection;
import java.util.List;

import com.dca.matrix.message.LongIdMessage;
import com.dca.matrix.message.LongIdsMessage;

public interface MatrixEntityService
{
	public List<MatrixEntity> getAllForCase(Long caseId);
	public List<MatrixEntity> getAllLinkChartForCase(Long caseId);
	public List<List<MatrixEntity>> searchEntities(MatrixEntitySearchMessage searchMessage);
	public List<List<MatrixEntity>> searchEntitiesNotLinked(MatrixEntitySearchMessage searchMessage);
	public EntityRelationship createRelationship(EntityRelationshipMessage message);
	public List<EntityRelationshipProjection2> getRelatedEntities(Long parentId);
	public EntityRelationship removeRelationship(LongIdMessage idMessage);
	public Collection<EntityRelationshipProjection> getCaseEntityRelationships(Long caseId);
	public Collection<MatrixEntity> getTimelineEntitiesForCase(Long caseId);
	public MatrixEntity store(MatrixEntity entity);
//	MatrixEntity findById(Long id);
//	MatrixEntity save(Long entityDefinitionId, Long entityId, List<PropertyValueMessage> propertyValueMessage);
//	EntityRelationship addRelationship(Long entity1Id, Long entity2Id, String entity1ToEntity2Description, String entity2ToEntity1Description);
//	List<MatrixEntity> searchEntities(EntitySearchMessage searchMessage);
//	List<MatrixEntity> searchEntitiesForRelationship(NewEntityRelationshipSearchMessage searchMessage);
	public MatrixEntity findById(Long matrixEntityId);
	public Iterable<MatrixEntity> findByIds(LongIdsMessage matrixEntityIds);
	public Collection<MatrixEntityProjection> getCaseEntityProjections(Long caseId);
	public Collection<MatrixEntityTitleDTO> findMatrixEntityTitlesByCase(Long caseId);
}