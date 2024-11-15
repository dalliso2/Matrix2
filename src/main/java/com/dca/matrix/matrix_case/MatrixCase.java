package com.dca.matrix.matrix_case;

import java.util.Set;

import com.dca.matrix.EntityBase;
import com.dca.matrix.case_entity.CaseEntity;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.user_case_role.UserCaseRole;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

	@Column(name = CASE_DESCRIPTION)
	private String description;
	
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "matrixCase")
	@JsonIgnore	
	private Set<UserCaseRole> userCaseRoles;
	
	@OneToMany(mappedBy = "matrixCase",fetch = FetchType.LAZY)
//	@JoinColumn(name = "CASE_ENTITY")
//	@OneToMany(mappedBy = "matrixCase",fetch = FetchType.LAZY)
//	@JsonIgnore
	private Set<MatrixEntity> caseEntites;
}
