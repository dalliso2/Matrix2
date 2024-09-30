package com.dca.matrix.matrix_case;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MatrixCaseDeserializer extends StdDeserializer<MatrixCase>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MatrixCaseDeserializer()
	{	
		this(null);
	}
	
	public MatrixCaseDeserializer(Class<MatrixCase> mCase)
	{
		super(mCase);
	}

	@Override
	public MatrixCase deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
		log.debug("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
		log.debug("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
		log.debug("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
		log.debug("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
		log.debug("" + jp.getLongValue());
        MatrixCase mcase = new MatrixCase();
        mcase.setId(jp.getLongValue());
        return mcase;
	}
}
