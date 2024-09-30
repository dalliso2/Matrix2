package com.dca.matrix.agency;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface AgencyRepository extends CrudRepository<Agency, Long>
{
	List<Agency> findAllByOrderByName();
}
