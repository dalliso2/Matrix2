package com.dca.matrix.case_file;

import com.dca.matrix.file.MFile;
import com.dca.matrix.file.MFileDeserializer;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseDeserializer;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

public class CaseFile extends MatrixEntity
{
	@ManyToOne
	@JoinColumn(name = "CASE_ID")
	@JsonDeserialize(using = MatrixCaseDeserializer.class)
	private MatrixCase matrixCase;

	@OneToOne
	@JsonDeserialize(using = MFileDeserializer.class)
	@JoinColumn(name = "MFILE_ID")
	private MFile mFile;
}
