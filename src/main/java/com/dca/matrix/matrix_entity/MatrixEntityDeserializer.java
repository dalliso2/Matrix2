package com.dca.matrix.matrix_entity;

import java.io.IOException;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

@Component
public class MatrixEntityDeserializer extends StdDeserializer<MatrixEntity>
{
	private final MatrixEntityService matrixEntityService;
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public MatrixEntityDeserializer(MatrixEntityService matrixEntityService)
	{
		super(MatrixEntity.class);
		this.matrixEntityService = matrixEntityService;
	}

	@Override
	public MatrixEntity deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
		MatrixEntity mEntity = this.matrixEntityService.findById(jp.getLongValue());
		//mEntity.setId(jp.getLongValue());
        return mEntity;
	}
}
