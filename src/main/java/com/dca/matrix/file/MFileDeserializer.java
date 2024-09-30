package com.dca.matrix.file;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

public class MFileDeserializer extends StdDeserializer<MFile>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MFileDeserializer()
	{
		this(null);
	}
	
	public MFileDeserializer(Class<MFile> mFile)
	{
		super(mFile);
	}

	@Override
	public MFile deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
		MFile mFile = new MFile();
		mFile.setId(jp.getLongValue());
        return mFile;
	}
}
