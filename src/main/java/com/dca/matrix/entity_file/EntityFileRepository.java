package com.dca.matrix.entity_file;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.dca.matrix.matrix_entity.MatrixEntity;

public interface EntityFileRepository extends CrudRepository<EntityFile, Long>
{
	@Query("Select ef from EntityFile ef, MatrixEntity me where me = :entity order by mFile.name")
	List<EntityFile> findForEntity(MatrixEntity entity);
}
