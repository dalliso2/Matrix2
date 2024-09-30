package com.dca.matrix.entity_definition;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

public class EntityDefinitionDeserializer extends StdDeserializer<EntityDefinition>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public EntityDefinitionDeserializer()
	{	
		this(null);
	}
	
	public EntityDefinitionDeserializer(Class<EntityDefinition> ed)
	{
		super(ed);
	}

	@Override
	public EntityDefinition deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
		EntityDefinition ed = new EntityDefinition();
        ed.setId(jp.getLongValue());
        return ed;
	}
}
