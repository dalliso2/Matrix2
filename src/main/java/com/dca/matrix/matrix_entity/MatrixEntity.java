package com.dca.matrix.matrix_entity;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import com.dca.matrix.EntityBase;
import com.dca.matrix.entity_definition.EntityDefinition;
import com.dca.matrix.entity_definition.EntityDefinitionDeserializer;
import com.dca.matrix.entity_definition.EntityDefinitionIDSerializer;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseDeserializer;
import com.dca.matrix.matrix_case.MatrixCaseSerializer;
import com.dca.matrix.property_value.PropertyValue;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id", scope = MatrixEntity.class)
public class MatrixEntity extends EntityBase
{	
	public MatrixEntity(Long id)
	{
		this.id = id;
	}
	
	@ManyToOne
	@JoinColumn(name = "ENTITY_DEFINITION_ID")
	//@JsonIdentityReference(alwaysAsId = true)
	@JsonSerialize(using = EntityDefinitionIDSerializer.class)
	@JsonDeserialize(using = EntityDefinitionDeserializer.class)
	private EntityDefinition entityDefinition;

	//@JsonIdentityReference(alwaysAsId = true)
	@ManyToOne
	@JoinColumn(name = "MATRIX_CASE_ID", nullable = false)
	@JsonDeserialize(using = MatrixCaseDeserializer.class)
	@JsonSerialize(using = MatrixCaseSerializer.class)
	private MatrixCase matrixCase;
	
	@OneToMany(mappedBy="matrixEntity", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval=true)
	private Collection<PropertyValue> propertyValues = new LinkedList<>();

	@OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
	@JsonIgnore
	@OrderBy("description")
	private List<EntityRelationship> entityRelationships;
	
	@Transient
	private List<EntityRelationship> relationships;

//	@Transient
//	private Collection<EntityRelationship> entityRelationships = new LinkedList<>();
//	
//	public Optional<Property> findPropertyByPropertyDefinitionId(Long id)
//	{
//		return this.properties.stream().filter(
//					tempProp -> tempProp.getPropertyDefinition().getId() == id).findAny();
//	}
//	
//	public void addProperty(Property property) 
//	{
//		this.properties.add(property);
//	}
//	
	public void addPropertyValue(PropertyValue val)
	{
		propertyValues.add(val);
		val.setMatrixEntity(this);
	}
	
	public String toString()
	{
		StringBuffer buf = new StringBuffer();
		this.propertyValues.forEach(prop -> { buf.append(prop.getValue()).append(" - "); });
		return buf.toString();
	}
	
}
	