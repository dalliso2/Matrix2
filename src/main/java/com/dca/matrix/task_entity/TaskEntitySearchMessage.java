package com.dca.matrix.task_entity;

public record TaskEntitySearchMessage(Long taskId, Long caseId, Long[] entityDefinitionIds, String searchText)
{
	
}
