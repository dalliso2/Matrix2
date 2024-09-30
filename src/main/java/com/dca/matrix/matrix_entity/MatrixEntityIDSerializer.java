package com.dca.matrix.matrix_entity;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class MatrixEntityIDSerializer extends JsonSerializer<MatrixEntity>
{

	@Override
	public void serialize(MatrixEntity me, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(me.getId());
	}
	
}
