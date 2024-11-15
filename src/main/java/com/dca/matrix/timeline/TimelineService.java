package com.dca.matrix.timeline;

import java.util.Collection;

public interface TimelineService
{
	TimelineDTO store(TimelineDTO timelineDTO);
	TimelineDTO findById(Long id);
	Collection<TimelineDTO> findByCase(Long caseId);
}
