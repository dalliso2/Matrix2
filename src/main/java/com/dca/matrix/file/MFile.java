package com.dca.matrix.file;

import com.dca.matrix.EntityBase;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Entity
@Table(name="MFILE")
@Getter
@Setter
public class MFile extends EntityBase
{	
	@Column(name="ORIGINAL_NAME")
	private String originalName;
	@Column(name="NAME")
	private String name;
	@Column(name="DESCRIPTION")
	private String description;
	
	// Every file must be associated to a case
	@OneToOne
	@JoinColumn(name = "MATRIX_CASE_ID")
	@JsonDeserialize(using = MatrixCaseDeserializer.class)
	@JsonSerialize(using = MatrixCaseIDSerializer.class)
	private MatrixCase matrixCase;
	
	public MFile()
	{
		
	}
	
	public MFile(String originalFileName)
	{
		this.originalName = originalFileName;
	}
	
	// return the name of the file in the server's file system.
	// currently appends _id to the file name
	public String getServerFileName()
	{
		log.debug("getServerFileName(): begin");
		String serverFileName = null;
		
		if (this.originalName.indexOf(".") > 0)
		{
			int lastDotIndex = this.originalName.lastIndexOf(".");
			serverFileName = this.originalName.substring(0, lastDotIndex) + "_" + this.id + this.originalName.substring(lastDotIndex);
		}
		else
			serverFileName = this.originalName + "_" + this.id;
		
		log.debug("getServerFileName(): returning " + serverFileName);
		log.debug("getServerFileName(): end");
		
		return serverFileName;
	}
}
