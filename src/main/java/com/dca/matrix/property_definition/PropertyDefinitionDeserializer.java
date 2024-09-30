package com.dca.matrix.property_definition;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

public class PropertyDefinitionDeserializer extends StdDeserializer<PropertyDefinition>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public PropertyDefinitionDeserializer()
	{	
		this(null);
	}
	
	public PropertyDefinitionDeserializer(Class<PropertyDefinition> pDef)
	{
		super(pDef);
	}

	@Override
	public PropertyDefinition deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
		PropertyDefinition pDef = new PropertyDefinition();
		pDef.setId(jp.getLongValue());
        return pDef;
	}
}
