package com.dca.matrix.timeline;

import java.util.Collection;
import java.util.LinkedList;

import com.dca.matrix.EntityBase;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_entity.MatrixEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Timeline extends EntityBase
{
	private String name;
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "MATRIX_CASE_ID", nullable = false)
	private MatrixCase matrixCase;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name="TIMELINE_ENTITY", 
				joinColumns = @JoinColumn(name = "TIMELINE_ID"), 
				inverseJoinColumns = @JoinColumn(name = "ENTITY_ID"))
	private Collection<MatrixEntity> timelineEntities = new LinkedList<>(); 
}
