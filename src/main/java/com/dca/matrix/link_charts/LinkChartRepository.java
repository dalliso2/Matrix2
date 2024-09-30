package com.dca.matrix.link_charts;

import java.util.Collection;

import org.springframework.data.repository.CrudRepository;

import com.dca.matrix.matrix_case.MatrixCase;

public interface LinkChartRepository extends CrudRepository<LinkChart, Long>
{
	Collection<LinkChart> findAllByMatrixCase(MatrixCase matrixCase);
}
