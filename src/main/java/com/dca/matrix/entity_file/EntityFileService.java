package com.dca.matrix.entity_file;

import java.util.Collection;
import java.util.List;

import com.dca.matrix.matrix_entity.MatrixEntity;

public interface EntityFileService
{
	EntityFile save(EntityFile entityFile);
	Collection<EntityFile> save(Collection<EntityFile> entityFiles);
	EntityFile remove(Long entityFileId);
	List<EntityFile> findForEntity(Long entityId);
}
