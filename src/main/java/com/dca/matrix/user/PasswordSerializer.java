package com.dca.matrix.user;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class PasswordSerializer extends JsonSerializer<String>
{	
	public PasswordSerializer()
	{
		super();
	}
	
	@Override
	public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeString(MatrixUser.EMPTY_PASSWORD);
	}
}
