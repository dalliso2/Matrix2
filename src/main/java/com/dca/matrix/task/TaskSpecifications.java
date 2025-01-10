package com.dca.matrix.task;

import java.util.Arrays;
import org.springframework.data.jpa.domain.Specification;

import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user.MatrixUser;
import jakarta.persistence.criteria.Join;


public class TaskSpecifications
{
	public static Specification<Task> caseEquals(Long caseId)
	{
		return (root, query, criteriaBuilder) -> 
		{
			Join<Task, MatrixCase> taskCase = root.join(Task_.matrixCase);
			return criteriaBuilder.equal(taskCase.get("id"),(caseId));
		};
	}
	
	public static Specification<Task> hasTitleLike(String title)
	{
		return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.<String>get(Task_.title),"%" + title + "%");
	}

	public static Specification<Task> hasDescriptionLike(String description)
	{
		return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.<String>get(Task_.description),"%" + description + "%");
	}
	
	public static Specification<Task> hasUsersIn(Long[] users)
	{
		return (root, query, criteriaBuilder) -> 
		{
			Join<Task, MatrixUser> taskUser = root.join(Task_.assignedTo);
			return taskUser.get("id").in(Arrays.asList(users));
		};
	}
	
	public static Specification<Task> hasStatusIn(Long[] statuss)
	{
		return (root, query, criteriaBuilder) -> 
		{
			return root.get(Task_.status).in(Arrays.asList(statuss));
		};
	}
}
