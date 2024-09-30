package com.dca.matrix.matrix_case;

public record MatrixEntitySearchMessage(Long caseId, Long[] entityDefinitionIds, String searchText)
{

}
