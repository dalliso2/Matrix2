package com.dca.matrix.matrix_entity;

import java.util.Collection;
import java.util.LinkedList;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyValueProjection
{
	private Long id;
	private String name;
	private Collection<Object> values = new LinkedList<>();

	public PropertyValueProjection(Long id, String name, Object value)
	{
		this.id = id;
		this.name = name;
		values.add(value);
	}
	
	public void addValue(Object value)
	{
		this.values.add(value);
	}
}
