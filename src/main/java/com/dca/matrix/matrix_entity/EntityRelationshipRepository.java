package com.dca.matrix.matrix_entity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface EntityRelationshipRepository extends CrudRepository<EntityRelationship, Long>
{
	@Query("Select entityRelationship from EntityRelationship entityRelationship where parent.id = :parentId and child.id = :childId")
	Optional<EntityRelationship> findByParentAndChild(Long parentId, Long childId);	
	
	@Query( value = """
			select er from EntityRelationship er where er.parent.id = :entityId
				or er.child.id = :entityId
				order by er.child.entityDefinition.id, er.child.id, er.parent.id
			""")
	List<EntityRelationship> getRelationships(Long entityId);
}
