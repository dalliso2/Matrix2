package com.dca.matrix.user;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationServiceImpl implements AuthenticationService
{
	@Override
	public MatrixUser getCurrentUser()
	{
		return (MatrixUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
