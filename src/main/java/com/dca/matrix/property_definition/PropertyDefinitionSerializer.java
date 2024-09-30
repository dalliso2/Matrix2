package com.dca.matrix.property_definition;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class PropertyDefinitionSerializer extends JsonSerializer<PropertyDefinition>
{

	@Override
	public void serialize(PropertyDefinition pDef, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(pDef.getId());
	}
	
}
