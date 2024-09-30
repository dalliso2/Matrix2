package com.dca.matrix.task;

public record TaskQueryParameters(long caseId, String searchString, Long[] assignedToIds, Long[] statusIds)
{

}
