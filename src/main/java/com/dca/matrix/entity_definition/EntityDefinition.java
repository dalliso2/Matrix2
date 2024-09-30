package com.dca.matrix.entity_definition;

import java.util.LinkedList;
import java.util.List;

import com.dca.matrix.EntityBase;
import com.dca.matrix.property_definition.PropertyDefinition;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
//@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id", scope = EntityDefinition.class)
public class EntityDefinition extends EntityBase
{
	// column names
	public static final String NAME = "name";
	public static final String VERSION = "version";
	public static final String EDITABLE = "editable";
	public static final String DESCRIPTION = "description";
	public static final String INCLUDE_IN_LINK_CHART = "INCLUDE_IN_LINK_CHART";
	public static final String ENTITY_DEFINITION_ID = "ENTITY_DEFINITION_ID";
	
	@Column(name = NAME)
	@NotNull
	private String name;
	
	@Column(name = VERSION)
	@NotNull
	private Long version;
	
	@Column(name = EDITABLE)
	@NotNull
	private Boolean editable = Boolean.TRUE;
	
	@Column(name = DESCRIPTION)
	private String description;
	
	@Column(name = INCLUDE_IN_LINK_CHART)
	private Boolean includeInLinkChart = Boolean.FALSE;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = ENTITY_DEFINITION_ID)
	@OrderBy(PropertyDefinition.PROP_ORDER)
	private List<PropertyDefinition> props = new LinkedList<PropertyDefinition>();
	
	public EntityDefinition()
	{
	}
}
