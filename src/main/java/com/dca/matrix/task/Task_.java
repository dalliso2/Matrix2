package com.dca.matrix.task;

import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user.MatrixUser;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Task.class)
public class Task_
{
	public static volatile SingularAttribute<Task, MatrixCase> matrixCase;
	public static volatile SingularAttribute<Task, Long> id;
	public static volatile SingularAttribute<Task, String> title;
	public static volatile SingularAttribute<Task, String> description;
	public static volatile SingularAttribute<Task, MatrixUser> assignedTo;
	public static volatile SingularAttribute<Task, TaskStatusEnum> status;
}
