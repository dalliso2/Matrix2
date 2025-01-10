package com.dca.matrix.matrix_case;

import java.util.HashSet;
import java.util.Set;

import com.dca.matrix.EntityBase;
import com.dca.matrix.case_entity.CaseEntity;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.user_case_role.UserCaseRole;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = MatrixCase.TABLE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MatrixCase extends EntityBase
{
	public MatrixCase(Long id)
	{
		this.id = id;
	}
	
	// table name
	public static final String TABLE = "matrix_case";
	// column names
	public static final String CASE_NUMBER = "case_number";
	public static final String CASE_TITLE = "case_title";
	public static final String CASE_DESCRIPTION = "case_description";
	
	@Column(name = CASE_NUMBER)
	private String caseNumber; 
	
	@Column(name = CASE_TITLE)
	private String title;

	@Column(name = CASE_DESCRIPTION, length=4096)
	private String description;
	
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "matrixCase", cascade = CascadeType.ALL)
	@JsonIgnore	
	private Set<UserCaseRole> userCaseRoles = new HashSet<>();
	
	@OneToMany(mappedBy = "matrixCase",fetch = FetchType.LAZY)
//	@JoinColumn(name = "CASE_ENTITY")
//	@OneToMany(mappedBy = "matrixCase",fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<MatrixEntity> caseEntites = new HashSet<>();
	
	public void addEntity(MatrixEntity entity)
	{
		this.caseEntites.add(entity);
		entity.setMatrixCase(this);
	}
}
