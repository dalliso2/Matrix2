package com.dca.matrix.timeline;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.dca.matrix.matrix_case.MatrixCase;

public interface TimelineRepository extends CrudRepository<Timeline, Long>
{
	Collection<Timeline> findByMatrixCaseOrderByName(MatrixCase matrixCase);
}
