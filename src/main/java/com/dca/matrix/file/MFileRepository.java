package com.dca.matrix.file;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.dca.matrix.matrix_entity.MatrixEntity;

public interface MFileRepository extends CrudRepository<MFile, Long>
{
//	@Query(value = """
//            select mf from MFile mf, EntityFile ef where \
//            	mf = ef.mFile \
//            	and ef.matrixEntity = :matrixEntity \
//            	and me = ef.matrixEntity \
//			 	and me.entityDefinition.id in :entityDefinitionIds\
//			    and ce.matrixCase.id in :caseId \
//			    and me in ( select propValue.matrixEntity from PropertyValue propValue \
//             where LOWER(value) like LOWER(CONCAT('%',:searchText,'%')) )\
//             and me.id not in ( select er.child.id from EntityRelationship er where er.parent.id = :parentId )\
//             and me.id != :parentId \
//             order by me.entityDefinition.id\
//            """)
//	List<MFile> searchFilesNotLinkedToEntity(MatrixEntity matrixEntity, String searchText);

	@Query(value = """
			select mf from MFile mf 
			where (LOWER(mf.name) like LOWER(CONCAT('%',:searchText,'%')) \
				or LOWER(mf.description) like LOWER(CONCAT('%',:searchText,'%'))) \
				and mf.id not in (SELECT ef.mFile.id from EntityFile ef where ef.matrixEntity.id = :matrixEntityId)
				order by mf.name, mf.description
		  """)
	List<MFile> searchFilesNotLinkedToEntity(Long matrixEntityId, String searchText);
	
	
	@Query(value = """
			select mf from MFile mf order by mf.name, mf.description
			""")
	List<MFile> searchFilesNotLinkedToTask();
	
//	@Query(value = """
//	  select mf from MFile mf where
//			
//	  """)
//List<MFile> searchFilesNotLinkedToEntity(MatrixEntity matrixEntity);
	
	
}
