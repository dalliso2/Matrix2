package com.dca.matrix.user;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class MatrixUserSerializer extends JsonSerializer<MatrixUser>
{	
	public MatrixUserSerializer()
	{
		super();
	}
	
	@Override
	public void serialize(MatrixUser user, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(user.getId());
	}
}
