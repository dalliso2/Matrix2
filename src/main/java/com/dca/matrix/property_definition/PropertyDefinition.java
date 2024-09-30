package com.dca.matrix.property_definition;

import com.dca.matrix.EntityBase;
import com.dca.matrix.entity_definition.EntityDefinition;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id", scope=PropertyDefinition.class)
public class PropertyDefinition extends EntityBase
{
	// column names
	public static final String ENTITY_DEFINITION_ID = "entity_definition_id";
	public static final String PROP_ORDER = "prop_order";
	public static final String REQUIRED = "required";
	public static final String INCLUDE_IN_LIST = "include_in_list";
	public static final String INCLOUDE_IN_TITLE = "include_in_title";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String TYPE = "type";
	public static final String MAX_LENGTH = "max_length";
	public static final String MASK = "mask";
	public static final String NUM_LINES = "num_lines";
	public static final String OPTIONS = "options";		
	
	@Column(name = "PROP_ORDER")
	@NotNull
	private int				propOrder;
	
	@Column(name = "REQUIRED")
	@NotNull
	private Boolean			required;
	
	@Column(name = "INCLUDE_IN_LIST")
	@NotNull
	private Boolean			includeInList;
	
	@Column(name = "INCLUDE_IN_TITLE")
	@NotNull
	private	Boolean			includeInTitle;
	
	@Column(name = "INCLUDE_IN_TIMELINE")
	@NotNull
	private	Boolean			includeInTimeline;

	@Column(name = "DELETED")
	@NotNull
	private Boolean			deleted;
	
	@Column(name = "NAME")
	@NotNull
	private String			name;
	
	@Column(name = "DESCRIPTION")
	private String			description;
	
	@Column(name = "TYPE")
	@NotNull
	@Enumerated(EnumType.ORDINAL)
	private PropertyType	type;

	// Optional properties depending on type
	@Column(name = "MAX_LENGTH")
	private Integer	maxLength;
	
	@Column(name = "MASK")
	private String	mask;
	
	@Column(name = "NUM_LINES")
	private Integer	numLines;
	
	@Column(name = "OPTIONS")
	private String options;
	
	public PropertyDefinition()
	{
		this.propOrder = 0;
		this.required = false;
		this.includeInList = false;
		this.includeInTitle = false;
		this.includeInTimeline = false;
		this.deleted = false;
	}

}
