package com.dca.matrix.entity_definition;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class EntityDefinitionIDSerializer extends JsonSerializer<EntityDefinition>
{

	@Override
	public void serialize(EntityDefinition ed, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(ed.getId());
	}
	
}
