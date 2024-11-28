package com.dca.matrix.agency;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface AgencyRepository extends CrudRepository<Agency, Long>
{
	List<Agency> findAllByOrderByName();
	Optional<Agency> findByName(String name);
	Optional<Agency> findByAcronym(String acronym);
}
