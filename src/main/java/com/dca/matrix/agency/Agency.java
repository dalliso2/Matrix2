package com.dca.matrix.agency;

import com.dca.matrix.EntityBase;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class Agency extends EntityBase
{
	public static final String NAME = "name";
	public static final String ACRONYM = "acronym";
	
	@Column(name = NAME, unique = true)
	private String name;
	
	@Column(name = ACRONYM, unique = true)
	private String acronym;
}
