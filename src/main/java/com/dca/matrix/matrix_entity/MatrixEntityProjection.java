package com.dca.matrix.matrix_entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;

import com.dca.matrix.property_definition.PropertyType;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@Slf4j
public class MatrixEntityProjection
{
	private Long id;
	private LinkedList<PropertyValueProjection> properties;
	private String title;
	private String imageId;

	public MatrixEntityProjection(Long id)
	{
		this.id = id;
		this.properties = new LinkedList<>();
	}
	
	public void setProperty(Long id, Long propertyType, String name, String value)
	{
		Iterator<PropertyValueProjection> i = this.properties.iterator();
		boolean propFound = false;
		while (i.hasNext())
		{
			PropertyValueProjection proj = i.next();
			if (proj.getId().equals(id))
			{
				proj.addValue(value);
				propFound = true;
			}
		}
		
		if (!propFound)
			this.properties.add(new PropertyValueProjection(id, name, value));
		
		if (propertyType.equals(Long.valueOf(PropertyType.PROFILE_IMAGE.ordinal())) || (propertyType.equals(Long.valueOf(PropertyType.IMAGE_ARRAY.ordinal())) && this.imageId == null))
		{
			this.imageId = value;
		}
	}
	
	public void addToTitle(String titlePart)
	{
		if (this.title == null)
			this.title = titlePart;
		else
			this.title = String.join(", ", this.title, titlePart);
	}
	
	@Override
	public boolean equals(Object other)
	{
		return this.id.equals(((MatrixEntityProjection)other).id);
	}
}
