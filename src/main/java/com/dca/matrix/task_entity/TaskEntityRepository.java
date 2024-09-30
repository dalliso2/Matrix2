package com.dca.matrix.task_entity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.task.Task;

public interface TaskEntityRepository extends CrudRepository<TaskEntity, Long>
{
	@Query("Select te from TaskEntity te where te.task.id = :taskId order by te.matrixEntity.entityDefinition.id")
	List<TaskEntity> findAllForTaskId(Long taskId);

	@Query("Select te from TaskEntity te where te.matrixEntity.id = :entityId order by te.matrixEntity.entityDefinition.id")
	List<TaskEntity> findAllForEntityId(Long entityId);
	
//	@Query(value = 	"""
//                select me from MatrixEntity me, MatrixCase mc where mc MEMBER OF me.matrixCases and \
//                 mc.id = :caseId and \
//                 me in ( select propValue.matrixEntity from PropertyValue propValue \
//                 where LOWER(value) like LOWER(CONCAT('%',:searchText,'%'))) \
//                 and me.entityDefinition.id in :entityDefinitionIds \
//                 and me not in (select te.matrixEntity from TaskEntity te where te.task.id = :taskId)\
//                """)
//	List<MatrixEntity> searchEntitiesNotLinkedToTask(Long taskId, Long caseId, Long[] entityDefinitionIds, String searchText);

	@Query(value = """
			select me from MatrixEntity me, Task t where \
			me.matrixCase = t.matrixCase and \
			me in ( select propValue.matrixEntity from PropertyValue propValue \
			              where LOWER(value) like LOWER(CONCAT('%',:searchText,'%'))) \
			and me.entityDefinition.id in :entityDefinitionIds \
			and me not in (select te.matrixEntity from TaskEntity te where te.task.id = :taskId)
			""")
	List<MatrixEntity> searchEntitiesNotLinkedToTask(Long taskId, Long[] entityDefinitionIds, String searchText);

	
	@Query(value = """
			select me from MatrixEntity me, Task t where 
			me.matrixCase = t.matrixCase and 
			me in ( select propValue.matrixEntity from PropertyValue propValue 
			              where LOWER(value) like LOWER(CONCAT('%',:searchText,'%'))) 
			and me not in (select te.matrixEntity from TaskEntity te where te.task.id = :taskId)
			order by me.entityDefinition.id
			""")
	List<MatrixEntity> searchEntitiesNotLinkedToTask(Long taskId, String searchText);

	Optional<TaskEntity> findByMatrixEntityAndTask(MatrixEntity entitiy, Task task);
//	@Query(value = 	"""
//            select me from MatrixEntity me, MatrixCase mc where mc MEMBER OF me.matrixCases and \
//             mc.id = :caseId and \
//             me in ( select propValue.matrixEntity from PropertyValue propValue \
//             where LOWER(value) like LOWER(CONCAT('%',:searchText,'%'))) \
//             and me not in (select te.matrixEntity from TaskEntity te where te.task.id = :taskId)\
//            """)
//	List<MatrixEntity> searchEntitiesNotLinkedToTask(Long taskId, Long caseId, String searchText);

//	@Query(value = 	"select me from MatrixEntity me, MatrixCase mc where mc MEMBER OF me.matrixCases")
//	List<MatrixEntity> a();
	
//	@Query(value = "select me from MatrixEntity me, TaskEntity te where me = te.matrixEntity "
//			+ " and me.entityDefinition.id in :entityDefinitionIds"
//			+ " and te.task.matrixCase.id in :caseId "
//			+ " and me in ( select propValue.matrixEntity from PropertyValue propValue "
//			+ " where LOWER(value) like LOWER(CONCAT('%',:searchText,'%')) )"
//			+ " and me.id not in ( select te.matrixEntity.id from TaskEntity te where te.task.id = :taskId )"
//			+ " order by me.entityDefinition.id")
//	List<MatrixEntity> searchEntitiesNotLinkedToTask(Long taskId, Long caseId, Long[] entityDefinitionIds, String searchText);
//
//	
//	@Query(value = "select me from MatrixEntity me, TaskEntity te where me = te.matrixEntity "
//			+ " and te.task.matrixCase.id in :caseId "
//			+ " and me in ( select propValue.matrixEntity from PropertyValue propValue "
//			+ " where LOWER(value) like LOWER(CONCAT('%',:searchText,'%')) )"
//			+ " and me.id not in ( select te.matrixEntity.id from TaskEntity te where te.task.id = :taskId )"
//			+ " order by me.entityDefinition.id")
//	List<MatrixEntity> searchEntitiesNotLinkedToTask(Long taskId, Long caseId, String searchText);
}
