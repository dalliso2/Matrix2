package com.dca.matrix.matrix_entity;

public record EntityRelationshipMessage(Long parentId, 
										Long childId, 
										String parentChildRelationshipDescription, 
										String childParentRelationshipDescription)
{
	
}
