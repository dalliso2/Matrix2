package com.dca.matrix.authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.dca.matrix.user.MatrixUser;

@Component
public class AuthenticationServiceImpl implements AuthenticationService
{
	@Override
	public MatrixUser getCurrentUser()
	{
		return (MatrixUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
