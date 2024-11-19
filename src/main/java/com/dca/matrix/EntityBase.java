package com.dca.matrix;

import java.time.Instant;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.beans.factory.annotation.Autowired;

import com.dca.matrix.user.AuthenticationService;
import com.dca.matrix.user.MatrixUser;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@MappedSuperclass
@Slf4j
public class EntityBase
{	
	public static final String ID = "ID";
	
	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	protected Long id;
	
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
	
	@PrePersist
	private void prePersist()
	{
		AuthenticationService authService = ApplicationContextProvider.getApplicationContext().getBean(AuthenticationService.class);
		if (authService != null)
			this.createdBy =  authService.getCurrentUser();
		this.createTime = Date.from(Instant.now());
		this.lastUpdatedBy = null;
		this.lastUpdateTime = null;
	}

	@PreUpdate
	private void preUpdate()
	{
		AuthenticationService authService = ApplicationContextProvider.getApplicationContext().getBean(AuthenticationService.class);
		if (authService != null)
			this.lastUpdatedBy =  authService.getCurrentUser();
		this.lastUpdateTime = Date.from(Instant.now());
	}
}
