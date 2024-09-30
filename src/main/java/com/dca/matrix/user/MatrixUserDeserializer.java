package com.dca.matrix.user;

import java.io.IOException;

import org.apache.logging.log4j.util.Strings;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.LongNode;

public class MatrixUserDeserializer extends StdDeserializer<MatrixUser>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MatrixUserDeserializer()
	{	
		this(null);
	}
	
	public MatrixUserDeserializer(Class<?> vc)
	{
		super(vc);
		// TODO Auto-generated constructor stub
	}

	@Override
	public MatrixUser deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException
	{
        MatrixUser mUser = new MatrixUser();
        
        JsonNode node = jp.getCodec().readTree(jp);
        if (Strings.isBlank(node.asText()))
        	mUser.setId(null);
        else
        	mUser.setId(node.asLong());
        
        return mUser;
	}
}
