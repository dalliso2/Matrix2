package com.dca.matrix.link_charts;

import com.dca.matrix.EntityBase;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseDeserializer;
import com.dca.matrix.matrix_case.MatrixCaseSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkChart extends EntityBase
{
	private String name;
	
	@ManyToOne
	@JoinColumn(name = "MATRIX_CASE_ID", nullable = false)
	@JsonDeserialize(using = MatrixCaseDeserializer.class)
	@JsonSerialize(using = MatrixCaseSerializer.class)
	private MatrixCase matrixCase;
	
	private String json;
}
