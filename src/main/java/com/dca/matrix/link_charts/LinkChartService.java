package com.dca.matrix.link_charts;

import java.util.Collection;
import java.util.List;

public interface LinkChartService
{
	Collection<LinkChart> getAllForCase(Long matrixCaseId);
	LinkChart store(LinkChart linkChart);
	LinkChart findById(Long id);
	LinkChart remove(Long linkChartId);
	List<LinkChartListItem> getLinkChartListItemsForCase(Long caseId);
	LinkChartNameDescriptionMessage updateLinkChartNameDescription(LinkChartNameDescriptionMessage nameDescriptionMessage);
}
