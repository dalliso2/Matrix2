package com.dca.matrix.task;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class TaskDeserializer extends StdDeserializer<Task>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public TaskDeserializer()
	{
		this(null);
	}
	
	public TaskDeserializer(Class<Task> task)
	{
		super(task);
	}

	@Override
	public Task deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
		Task task = new Task();
		task.setId(jp.getLongValue());
        return task;
	}
}
