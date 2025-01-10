package com.dca.matrix.user_case_role;

import java.time.Instant;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.dca.matrix.ApplicationContextProvider;
import com.dca.matrix.EntityBase;
import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user.MatrixUser;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = UserCaseRole.TABLE)
@Data
@NoArgsConstructor
public class UserCaseRole
{
	// table name
	public static final String TABLE = "user_case_role";
	// column names
	public static final String USER_ID = "user_id";
	public static final String CASE_ID = "case_id";
	public static final String ROLE = "case_role";
	
	@EmbeddedId
	@NotNull
	private UserCaseKey id = new UserCaseKey();
	
	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("userId")
	@JoinColumn(name = USER_ID)
	@JsonIgnore
	private MatrixUser user;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("caseId")
	@JoinColumn(name = CASE_ID)
	@JsonIgnore
	private MatrixCase matrixCase;
	
	@Column(name = ROLE)
	private CaseRoleEnum caseRole;
	
	@Column(name = "CREATE_TIME")
	@Temporal(TemporalType.TIMESTAMP)
	@CreationTimestamp
	@JsonIgnore
	protected Date createTime;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CREATED_BY")
	@JsonIgnore
	protected MatrixUser createdBy;
	
	@Column(name = "LAST_UPDATE_TIME")
	@Temporal(TemporalType.TIMESTAMP)
	@UpdateTimestamp
	@JsonIgnore
	protected Date lastUpdateTime;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "LAST_UPDATED_BY")
	@JsonIgnore
	protected MatrixUser lastUpdatedBy;
	
	public UserCaseRole(MatrixUser user, MatrixCase mCase, CaseRoleEnum role)
	{
		this.user = user;
		this.matrixCase = mCase;
		this.caseRole = role;
	}
	
	public UserCaseKey getId() { return this.id; }
	
//	@PrePersist
//	private void prePersist()
//	{
//		AuthenticationService authService = ApplicationContextProvider.getApplicationContext().getBean(AuthenticationService.class);
//		if (authService != null)
//			this.createdBy =  authService.getCurrentUser();
//		this.createTime = Date.from(Instant.now());
//		this.lastUpdatedBy = null;
//		this.lastUpdateTime = null;
//	}
//
//	@PreUpdate
//	private void preUpdate()
//	{
//		AuthenticationService authService = ApplicationContextProvider.getApplicationContext().getBean(AuthenticationService.class);
//		if (authService != null)
//			this.lastUpdatedBy =  authService.getCurrentUser();
//		this.lastUpdateTime = Date.from(Instant.now());
//	}

}
