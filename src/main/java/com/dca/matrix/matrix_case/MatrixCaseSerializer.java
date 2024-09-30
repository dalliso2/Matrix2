package com.dca.matrix.matrix_case;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class MatrixCaseSerializer extends JsonSerializer<MatrixCase>
{

	@Override
	public void serialize(MatrixCase mCase, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(mCase.getId());
	}
	
}
