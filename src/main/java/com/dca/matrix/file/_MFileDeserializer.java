package com.dca.matrix.file;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class _MFileDeserializer extends StdDeserializer<MFile>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Autowired
	private MFileRepository mFileRepository;
	
	public _MFileDeserializer()
	{	
		this(null);
	}
	
	public _MFileDeserializer(Class<?> vc)
	{
		super(vc);
		// TODO Auto-generated constructor stub
	}

	@Override
	public MFile deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
        JsonNode node = jp.getCodec().readTree(jp);
        Long id = node.asLong();
        return  this.mFileRepository.findById(id).get();
    }
}
