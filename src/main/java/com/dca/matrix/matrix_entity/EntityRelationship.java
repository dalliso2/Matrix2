package com.dca.matrix.matrix_entity;

import com.dca.matrix.EntityBase;
import com.dca.matrix.entity_definition.EntityDefinitionIDSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data  
public class EntityRelationship extends EntityBase
{
	@ManyToOne
	@JsonSerialize(using = MatrixEntityIDSerializer.class)
	private MatrixEntity parent;
	
	@ManyToOne
	@JoinColumn
	//@JsonIgnore
	//@JsonSerialize(using = MatrixEntityIDSerializer.class)
	private MatrixEntity child;

	@Column(name = "RELATIONSHIP_DESCRIPTION")
	private String description;
}
