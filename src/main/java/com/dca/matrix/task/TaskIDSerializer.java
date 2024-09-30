package com.dca.matrix.task;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class TaskIDSerializer extends JsonSerializer<Task>
{

	@Override
	public void serialize(Task task, JsonGenerator gen, SerializerProvider serializers) throws IOException
	{
		gen.writeNumber(task.getId());
	}
	
}
