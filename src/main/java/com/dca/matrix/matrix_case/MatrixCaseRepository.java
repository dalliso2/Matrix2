package com.dca.matrix.matrix_case;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface MatrixCaseRepository extends CrudRepository<MatrixCase, Long>
{
	Optional<MatrixCase> findByCaseNumber(String name);
}
