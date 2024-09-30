package com.dca.matrix.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;


public interface TaskRepository extends CrudRepository<Task, Long>, JpaSpecificationExecutor<Task>
{
	@Query("select t from Task t where matrixCase =?1")
	List<Task> findByMatrixCaseId(Long caseId);
	
	@Query("select t from Task t where assignedTo =?1")
	List<Task> findByAssignedToId(Long userId);
}
