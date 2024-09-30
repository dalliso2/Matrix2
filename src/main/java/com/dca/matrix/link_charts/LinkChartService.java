package com.dca.matrix.link_charts;

import java.util.Collection;

public interface LinkChartService
{
	Collection<LinkChart> getAllForCase(Long matrixCaseId);
	LinkChart store(LinkChart linkChart);
	LinkChart remove(Long linkChartId);
}
