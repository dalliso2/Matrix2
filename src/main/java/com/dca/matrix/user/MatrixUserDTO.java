package com.dca.matrix.user;

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
							Long profileImage)
{
	MatrixUserDTO(MatrixUser user)
	{
		this(user.getId(), user.getUsername(), MatrixUser.EMPTY_PASSWORD, user.getLastName(), user.getFirstName(), user.getEmail(),
				user.getWorkNumber(), user.getCellNumber(), user.getAgency().getId(), user.getIsAdmin(),
				user.getEnabled(), user.getDarkTheme(), user.getProfileImage()!=null?user.getProfileImage().getId():null);
	}
}