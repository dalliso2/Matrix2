package com.dca.matrix.user;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

public record MatrixUserDTO(Long id, 
							String username, 
							String password, 
							String lastName, 
							String firstName,
							String email,
							String workNumber,
							String cellNumber,
							Long agency,
							Boolean isAdmin,
							Boolean enabled,
							Boolean darkTheme,
							Long profileImage,
							Collection<String> authorities)
{
	public MatrixUserDTO(MatrixUser user)
	{
		this(user.getId(), user.getUsername(), MatrixUser.EMPTY_PASSWORD, user.getLastName(), user.getFirstName(), user.getEmail(),
				user.getWorkNumber(), user.getCellNumber(), user.getAgency()!=null?user.getAgency().getId():null, user.getIsAdmin(),
				user.getEnabled(), user.getDarkTheme(), user.getProfileImage()!=null?user.getProfileImage().getId():null,
				user.getAuthorities().stream().map(x->x.getAuthority()).toList());
	}
}