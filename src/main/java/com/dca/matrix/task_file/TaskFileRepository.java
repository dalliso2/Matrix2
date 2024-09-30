package com.dca.matrix.task_file;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.dca.matrix.file.MFile;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.task.Task;

public interface TaskFileRepository extends CrudRepository<TaskFile, Long>
{
	@Query("Select tf from TaskFile tf where tf.task.id = :taskId order by tf.matrixFile.name")
	List<TaskFile> findAllForTaskId(Long taskId);

//	@Query("Select tf from TaskFile tf where tf.matrixEntity.id = :fileId order by tf.matrixFile.name")
//	List<TaskFile> findAllForEntityId(Long fileId);
	
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
			select mf from MFile mf, MatrixCase mc
			where	mf.matrixCase = mc
					and mc.id = :caseId
					and ( 	LOWER(mf.name) like LOWER(CONCAT('%',:searchText,'%')) OR
							LOWER(mf.description) like LOWER(CONCAT('%',:searchText,'%')) OR
							LOWER(mf.originalName) like LOWER(CONCAT('%',:searchText,'%')))
					and mf not in (select mf from MFile mf, TaskFile tf 
										where tf.matrixFile = mf
										 		and tf.task.id = :taskId)
			""")
	List<MFile> searchFilesNotLinkedToTask(Long taskId, Long caseId, String searchText);

	@Query(value = """
			select mf from MFile mf, MatrixCase mc
			where	mf.matrixCase = mc
					and mc.id = :caseId
					and mf not in (select mf from MFile mf, TaskFile tf 
										where tf.matrixFile = mf
										 		and tf.task.id = :taskId)
			""")
	List<MFile> searchFilesNotLinkedToTask(Long taskId, Long caseId);

	Optional<TaskFile> findByTaskAndMatrixFile(Task task, MFile file);

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
