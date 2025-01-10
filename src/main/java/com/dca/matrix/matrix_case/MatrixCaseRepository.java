package com.dca.matrix.matrix_case;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface MatrixCaseRepository extends CrudRepository<MatrixCase, Long>
{
	Optional<MatrixCase> findByCaseNumber(String name);
	List<MatrixCase> findAllByOrderByCaseNumber();
	
	@Query(value = """
            select mc from MatrixCase mc where \
             LOWER(mc.caseNumber) like LOWER(CONCAT('%',:searchText,'%')) \
             or LOWER(mc.title) like LOWER(CONCAT('%',:searchText,'%')) \
             order by mc.caseNumber \
            """)
	List<MatrixCase> searchCases(String searchText);
}
