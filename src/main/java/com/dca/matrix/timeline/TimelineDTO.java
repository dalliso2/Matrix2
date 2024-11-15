package com.dca.matrix.timeline;

import java.util.Collection;
import java.util.LinkedList;

import com.dca.matrix.matrix_entity.MatrixEntityTitleDTO;

public record TimelineDTO(Long id, Long matrixCaseId, String name, String description, Collection<Long> matrixEntityIds)
{
	public TimelineDTO(Timeline t)
	{
		this(t.getId(), t.getMatrixCase().getId(), t.getName(), t.getDescription(), new LinkedList<Long>());
		t.getTimelineEntities().forEach(te->this.matrixEntityIds.add(te.getId()));
	}
}
