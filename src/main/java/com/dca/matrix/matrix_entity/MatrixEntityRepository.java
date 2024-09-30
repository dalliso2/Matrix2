package com.dca.matrix.matrix_entity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.dca.matrix.matrix_case.MatrixCase;

public interface MatrixEntityRepository extends CrudRepository<MatrixEntity, Long>
{
//	@Query(value = "select count(*) from MatrixEntity me where entityDefinition.id = ?1")
//	public Long getEntityCountofTypeEntityDefinition(Long id);
//	
//	@Query("Select entity from MatrixEntity entity where entityDefinition.id = ?1")
//	List<MatrixEntity> searchEntities(Long entityDefinitionId);

//	@Query("Select entity from MatrixEntity entity where entity.entityDefinition.id in :entityDefinitionIds"
//			+ " and entity in (select prop.entity from Property prop where "
//			+ " prop in ( select propValue.property from PropertyValue propValue where val like %:searchString%))")
//	List<MatrixEntity> searchEntities(Long[] entityDefinitionIds, String searchString);

//	@Query("Select entity from MatrixEntity entity where "
//			+ " entityDefinition.id in :entityDefinitionIds and "
//			+ " entity.id in "
//			+ " ( select propValue.matrixEntity.id from PropertyValue propValue where value like %:searchString%) ")
//	List<MatrixEntity> searchEntities(Long[] entityDefinitionIds, String searchString);

//	@Query("Select entity from MatrixEntity entity where "
//			+ " entity.entityDefinition.id in :entityDefinitionIds and "
//			+ " entity in ( select propValue.matrixEntity from PropertyValue propValue " 
//			+ " where value like CONCAT('%',:searchText,'%') )")
//	List<MatrixEntity> searchEntities(Long caseId, Long[] entityDefinitionIds, String searchText);

//	@Query("Select entity from MatrixEntity entity where "
//			+ " entity.matrixCases.id = :caseId and "
//			+ " entity in ( select propValue.matrixEntity from PropertyValue propValue " 
//			+ " where value like CONCAT('%',:searchText,'%') )")
//	List<MatrixEntity> searchEntities(Long caseId, String searchText);
	
//	@Query(value = "select me from MatrixEntity me left join me.matrixCases mc where mc.matrixCase.id = 1 ")
	@Query(value = """
                    select me from MatrixEntity me where \
                     me.entityDefinition.id in :entityDefinitionIds \
                     and me.matrixCase.id = :caseId \
                     and me in ( select propValue.matrixEntity from PropertyValue propValue \
                     where LOWER(value) like LOWER(CONCAT('%',:searchText,'%')) ) \
                     order by me.entityDefinition.id\
                    """)
	List<MatrixEntity> searchEntities(Long caseId, Long[] entityDefinitionIds, String searchText);

	@Query(value = """
            select me from MatrixEntity me where \
             me.matrixCase.id = :caseId \
             and me in ( select propValue.matrixEntity from PropertyValue propValue \
             where LOWER(value) like LOWER(CONCAT('%',:searchText,'%')) ) \
             order by me.entityDefinition.id\
            """)
	List<MatrixEntity> searchEntities(Long caseId, String searchText);
	
	@Query(value = """
            select me from MatrixEntity me where \
             me.entityDefinition.id in :entityDefinitionIds \
             and me.matrixCase.id = :caseId \
             and me in ( select propValue.matrixEntity from PropertyValue propValue \
             			where LOWER(value) like LOWER(CONCAT('%',:searchText,'%')) ) \
             and me.id not in ( select er.child.id from EntityRelationship er where er.parent.id = :parentId ) \
             and me.id != :parentId \
             order by me.entityDefinition.id\
            """)
	List<MatrixEntity> searchEntitiesNotLinked(Long parentId, Long caseId, Long[] entityDefinitionIds, String searchText);

	@Query(value = """
            select me from MatrixEntity me where \
             me.matrixCase.id = :caseId \
             and me in ( select propValue.matrixEntity from PropertyValue propValue \
             where LOWER(value) like LOWER(CONCAT('%',:searchText,'%'))) \
             and me.id not in ( select er.child.id from EntityRelationship er where er.parent.id = :parentId )\
             and me.id != :parentId \
             order by me.entityDefinition.id \
            """)
	List<MatrixEntity> searchEntitiesNotLinked(Long parentId, Long caseId, String searchText);

	@Query(value = """
                    select me from MatrixEntity me where \
                     me.matrixCase.id = :caseId\
                    """)
	List<MatrixEntity> findAllByMatrixCase(Long caseId);

	@Query(value = """
            select me from MatrixEntity me, EntityDefinition ed where
            	me.entityDefinition = ed
            	and ed.includeInLinkChart = true
             	and me.matrixCase.id = :caseId
            """)
	List<MatrixEntity> findAllLinkChartEntitiesByCase(Long caseId);
	
	@Query(value = """
                    select me from MatrixEntity me, PropertyValue pv, PropertyDefinition pd \
                     where me.id = pv.matrixEntity.id \
                     and pv.propertyDefinition.id = pd.id \
                     and pd.includeInTimeline = true \
                     and me.matrixCase.id = :caseId\
                    """)
	List<MatrixEntity> findAllTimelineEntities(Long caseId);

	
//	@Query(value = "select me from MatrixEntity me, CaseEntity ce "
//			+ " where me = ce.matrixEntity "
//			+ " and ce.matrixCase.id in :caseId "
//			+ " and me in ( select propValue.matrixEntity from PropertyValue propValue "
//			+ " where LOWER(value) like LOWER(CONCAT('%',:searchText,'%'))) "
//			+ " and me.id not in ( select er.child.id from EntityRelationship er where er.parent.id = :parentId )"
//			+ " and me.id != :parentId "
//			+ " order by me.entityDefinition.id ")
//	List<MatrixEntity> searchEntitiesNotLinkedToTask(Long caseId, Long taskId, String searchText);
}
