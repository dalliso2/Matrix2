package com.dca.matrix.task;

import java.util.Date;

import com.dca.matrix.EntityBase;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseDeserializer;
import com.dca.matrix.matrix_case.MatrixCaseSerializer;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserDeserializer;
import com.dca.matrix.user.MatrixUserSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = Task.TABLE)
public class Task extends EntityBase
{
	public static final String 	TABLE = "task";
	public static final String 	TITLE = "title";
	public static final String 	DESCRIPTION = "description";
	public static final String 	COVERAGE_DESCRIPTION = "coverage_description";
	public static final String 	CASE_ID = "case_id";
	public static final String 	ASSIGNED_TO = "assigned_to";
	public static final String	ASSIGNED_DATE_TIME = "assigned_date_time";
	public static final String 	DUE_DATE_TIME = "due_date_time";
	public static final String  COMPLETED_DATE_TIME = "completed_date_time";
	public static final String 	STATUS = "status";
	
	@Column(name = "case_task_id")
	private Long caseTaskId;
	
	@Column(name = TITLE)
	private String title;
	
	@Column(name = DESCRIPTION, columnDefinition="VARCHAR(2048)")
	private String description;
	
	@Column(name = COVERAGE_DESCRIPTION, columnDefinition="VARCHAR(2048)")
	private String coverageDescription;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = CASE_ID, nullable = false)
	@JsonDeserialize(using = MatrixCaseDeserializer.class)
	@JsonSerialize(using = MatrixCaseSerializer.class)
	private MatrixCase matrixCase;

	@ManyToOne
	@JoinColumn(name = ASSIGNED_TO, nullable = true)
	@JsonDeserialize(using = MatrixUserDeserializer.class)
	@JsonSerialize(using = MatrixUserSerializer.class)
	private MatrixUser assignedTo;
	
	@Column(name = ASSIGNED_DATE_TIME)
	private Date assignedDateTime;
	
	@Column(name = DUE_DATE_TIME)
	private Date dueDateTime;
	
	@Column(name = COMPLETED_DATE_TIME)
	private Date completedDateTime;	
	
	@Column(name = STATUS)
	private TaskStatusEnum status = TaskStatusEnum.NOT_STARTED;
}
