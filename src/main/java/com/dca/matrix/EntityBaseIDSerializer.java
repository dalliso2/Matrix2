package com.dca.matrix;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class EntityBaseIDSerializer extends JsonSerializer<EntityBase>
{
	@Override
	public void serialize(EntityBase me, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(me.getId());
	}
	
}
