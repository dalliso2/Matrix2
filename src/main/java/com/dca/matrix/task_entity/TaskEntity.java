package com.dca.matrix.task_entity;

import com.dca.matrix.EntityBase;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityDeserializer;
import com.dca.matrix.matrix_entity.MatrixEntityIDSerializer;
import com.dca.matrix.task.Task;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TASK_ENTITY")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskEntity extends EntityBase
{
	@ManyToOne
	private Task task;
	
	@ManyToOne
	private MatrixEntity matrixEntity;
	
	@Column(name="description", length=512)
	private String description;
}
