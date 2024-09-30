package com.dca.matrix.case_entity;

import com.dca.matrix.EntityBase;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseDeserializer;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "CASE_ENTITY")
@Data
public class CaseEntity extends EntityBase
{	
	@ManyToOne
	@JsonDeserialize(using = MatrixEntityDeserializer.class)
	private MatrixEntity 	matrixEntity;
	
	@ManyToOne
	@JsonDeserialize(using = MatrixCaseDeserializer.class)
	private MatrixCase 		matrixCase;
}
