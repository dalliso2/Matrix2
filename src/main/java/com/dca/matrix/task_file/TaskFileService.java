package com.dca.matrix.task_file;

import java.util.Collection;
import java.util.List;

import com.dca.matrix.file.MFile;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.task.Task;

public interface TaskFileService
{
	Collection<TaskFile> save(Collection<TaskFileMessage> taskEntityMessages);
	TaskFile delete(Long taskEntityId);
	List<TaskFile> findAllForTaskId(Long taskId);
	List<MFile> searchFilesNotLinked(TaskFileSearchMessage searchMessage);
}
