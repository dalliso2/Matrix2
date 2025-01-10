package com.dca.matrix.property_value;

import com.dca.matrix.EntityBase;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.property_definition.PropertyDefinition;
import com.dca.matrix.property_definition.PropertyDefinitionDeserializer;
import com.dca.matrix.property_definition.PropertyDefinitionSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="PROPERTY_VALUE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyValue extends EntityBase
{	
	@ManyToOne
	@JoinColumn(name = "ENTITY_ID", nullable=false)
	//@JsonIdentityReference(alwaysAsId = true)
	@JsonDeserialize(using = PropertyDefinitionDeserializer.class)
	@JsonIgnore
	private MatrixEntity matrixEntity;
	
	@ManyToOne
	@JoinColumn(name = "PROPERTY_DEFINITION_ID")
	//@JsonIdentityReference(alwaysAsId = true)
	@JsonDeserialize(using = PropertyDefinitionDeserializer.class)
	@JsonSerialize(using = PropertyDefinitionSerializer.class)
	private PropertyDefinition propertyDefinition;
	
	@Column(name = "VALUE_ORDER")
	private Long valOrder;
	
	@Column(name = "VAL")
	private String value;
	
	public PropertyValue(String val)
	{
		this.value = val;
	}
	
	public String toString()
	{
		return this.value;
	}
}
