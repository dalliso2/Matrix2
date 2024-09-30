package com.dca.matrix.matrix_entity;

public record MatrixEntitySearchMessage(Long parentId, Long caseId, Long[] entityDefinitionIds, String searchText)
{

}
