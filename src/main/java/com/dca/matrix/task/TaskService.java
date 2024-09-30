package com.dca.matrix.task;

import java.util.Collection;
import java.util.List;

public interface TaskService
{
	Task createUpdateTask(Task task);
	Task getTask(Long id);
	List<Task> getTasksForCase(Long caseId);
	List<Task> getTasksAssignedToUser(Long userId);
	Iterable<Task> searchTasks(TaskQueryParameters queryParameters);
}
