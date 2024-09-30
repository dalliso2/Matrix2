package com.dca.matrix.entity_file;

import com.dca.matrix.EntityBase;
import com.dca.matrix.EntityBaseIDSerializer;
import com.dca.matrix.file.MFile;
import com.dca.matrix.file.MFileDeserializer;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityDeserializer;
import com.dca.matrix.matrix_entity.MatrixEntityIDSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ENTITY_FILE")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntityFile extends EntityBase
{
	@ManyToOne
	@JsonDeserialize(using = MatrixEntityDeserializer.class)
	@JsonSerialize(using = MatrixEntityIDSerializer.class)
	private MatrixEntity matrixEntity;
	
	@ManyToOne
	@JsonDeserialize(using = MFileDeserializer.class)
	private MFile mFile;
}
