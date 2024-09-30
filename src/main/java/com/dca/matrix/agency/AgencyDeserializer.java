package com.dca.matrix.agency;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.LongNode;

/*
 *
 */
public class AgencyDeserializer extends StdDeserializer<Agency>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public AgencyDeserializer()
	{	
		this(null);
	}
	
	public AgencyDeserializer(Class<?> vc)
	{
		super(vc);
	}

	@Override
	public Agency deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
        JsonNode node = jp.getCodec().readTree(jp);
        Long id = node.asLong();
        Agency agency = new Agency();
        agency.setId(id);

        return agency;
	}
}
