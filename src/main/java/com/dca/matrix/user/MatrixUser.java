package com.dca.matrix.user;

import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Objects;
import java.util.Set;

import org.hibernate.mapping.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.dca.matrix.EntityBase;
import com.dca.matrix.agency.Agency;
import com.dca.matrix.agency.AgencyDeserializer;
import com.dca.matrix.file.MFile;
import com.dca.matrix.file.MFileDeserializer;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user_case_role.CaseRoleEnum;
import com.dca.matrix.user_case_role.UserCaseRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name=MatrixUser.TABLE)
@Data
@NoArgsConstructor(force = true)
public class MatrixUser extends EntityBase implements UserDetails, Cloneable
{
	private static final long serialVersionUID = 1L;
	// table name
	public static final String TABLE = "matrix_user";
	// column name
	public static final String USERNAME = "username";
	public static final String PASSWORD = "password";
	public static final String LAST_NAME = "last_name";
	public static final String FIRST_NAME = "first_name";
	public static final String EMAIL = "email";
	public static final String PROFILE_IMAGE_ID = "profile_image_id";
	public static final String CELL_NUMBER = "cell_number";
	public static final String WORK_NUMBER = "work_number";
	public static final String AGENCY_ID = "agency_id";
	public static final String ADMIN = "admin";
	public static final String ENABLED = "enabled";
	public static final String DARK_THEME = "dark_theme";
	// Roles
	public static final String ROLE_USER = "ROLE_USER";
	public static final String ROLE_ADMIN = "ROLE_ADMIN";
	
	
	public static int PASSWORD_MIN_LENGTH = 8;
	
	// EMPTY_PASSWORD is used to return an empty string of the minimum
	// eight characters through the api, since we never want to return
	// the actual hash of the password
	public static String EMPTY_PASSWORD = "        ";

	@Column(name = USERNAME, unique=true)
	private String username;
	
	@Column(name = PASSWORD, nullable = false)
	@JsonSerialize(using = PasswordSerializer.class, as = String.class)
	private String password;
	
	@Column(name = LAST_NAME, nullable = false)
	private String lastName;

	@Column(name = FIRST_NAME, nullable = false)
	private String firstName;

	@Column(name = EMAIL)
	private String email;

	@Column(name = CELL_NUMBER)
	private String cellNumber;
	
	@Column(name = WORK_NUMBER)
	private String workNumber;
	
	@Column(name = ADMIN, nullable = false)
	private Boolean isAdmin = false;

	@Column(name = ENABLED, nullable = false)
	private Boolean enabled = true;
	
	@Column(name = DARK_THEME, nullable = false)
	private Boolean darkTheme = false;

	@OneToMany(fetch=FetchType.LAZY, mappedBy = "user")
	@JsonIgnore
	private Collection<UserCaseRole> userCaseRoles = new LinkedList<>();
	
	@Transient
	private boolean existingUser;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = AGENCY_ID, nullable = true)
	@JsonDeserialize(using = AgencyDeserializer.class)
	private Agency agency;
	
	@OneToOne
	@JoinColumn(name = PROFILE_IMAGE_ID)
	@JsonDeserialize(using = MFileDeserializer.class)
	private MFile profileImage;
	
	@Override
	@JsonIgnore 	
	public Collection<? extends GrantedAuthority> getAuthorities()
	{
		var authorities = new LinkedList<GrantedAuthority>();
		authorities.add(new SimpleGrantedAuthority(ROLE_USER));
		if (this.isAdmin)
			authorities.add(new SimpleGrantedAuthority(ROLE_ADMIN));
				
		this.userCaseRoles.forEach(ucr->
			authorities.add(new SimpleGrantedAuthority("CASE_" + ucr.getMatrixCase().getId() + "_" + ucr.getCaseRole())));
		
		return authorities;
	}

	@Override
	public String getUsername()
	{
		return this.username;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonExpired()
	{
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonLocked()
	{
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isCredentialsNonExpired()
	{
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled()
	{
		return this.enabled;
	}

	public boolean equalsExcludePassword(MatrixUser otherUser)
	{
		return Objects.equals(this.username, otherUser.username) 
				&& Objects.equals(this.firstName, otherUser.firstName)
				&& Objects.equals(this.lastName, otherUser.lastName)
				&& Objects.equals(this.enabled, otherUser.enabled)
				&& Objects.equals(this.isAdmin, otherUser.isAdmin);
	}
	
	public CaseRoleEnum getCaseRole(MatrixCase mCase)
	{
		CaseRoleEnum caseRole = CaseRoleEnum.None;
		for (UserCaseRole ucr:this.getUserCaseRoles())
		{
			if (ucr.getMatrixCase().equals(mCase))
			{
				caseRole = ucr.getCaseRole();
				break;
			}
		}
		return caseRole;
	}
	
	public boolean isCaseOwner(MatrixCase mCase)
	{
		return this.isAdmin || this.getCaseRole(mCase).equals(CaseRoleEnum.Owner);
	}
	
	public boolean isCaseParticipant(MatrixCase mCase)
	{
		return this.isCaseOwner(mCase) || this.getCaseRole(mCase).equals(CaseRoleEnum.Participant);
	}
	
	public boolean isCaseReviewer(MatrixCase mCase)
	{
		return this.isCaseParticipant(mCase) || this.getCaseRole(mCase).equals(CaseRoleEnum.Reviewer);
	}
	
	public String toString()
	{
		return this.username;
	}
	
	@Override
	public boolean equals(Object that)
	{
		return this.id.equals(that);
	}
}
