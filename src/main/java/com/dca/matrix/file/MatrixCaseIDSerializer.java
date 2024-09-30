package com.dca.matrix.file;

import java.io.IOException;

import com.dca.matrix.matrix_case.MatrixCase;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class MatrixCaseIDSerializer extends JsonSerializer<MatrixCase>
{

	@Override
	public void serialize(MatrixCase mc, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(mc.getId());
	}
	
}
