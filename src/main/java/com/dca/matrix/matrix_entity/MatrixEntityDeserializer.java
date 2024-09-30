package com.dca.matrix.matrix_entity;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

public class MatrixEntityDeserializer extends StdDeserializer<MatrixEntity>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MatrixEntityDeserializer()
	{
		this(null);
	}
	
	public MatrixEntityDeserializer(Class<MatrixEntity> mEntity)
	{
		super(mEntity);
	}

	@Override
	public MatrixEntity deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
		MatrixEntity mEntity = new MatrixEntity();
		mEntity.setId(jp.getLongValue());
        return mEntity;
	}
}
