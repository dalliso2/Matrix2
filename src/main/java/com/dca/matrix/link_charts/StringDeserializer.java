package com.dca.matrix.link_charts;

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
public class StringDeserializer extends StdDeserializer<String>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public StringDeserializer()
	{
		this(null);
	}
	
	public StringDeserializer(Class<String> val)
	{
		super(val);
	}

	@Override
	public String deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
        return jp.getCodec().readTree(jp).toString();
	}
}
