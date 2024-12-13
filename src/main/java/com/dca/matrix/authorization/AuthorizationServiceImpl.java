package com.dca.matrix.authorization;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user.MatrixUser;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthorizationServiceImpl implements AuthorizationService
{
	private final AuthenticationService authenticationService;
	
	@Override
	public void canView(MatrixCase mCase) throws AccessDeniedException
	{
		this.authenticationService.getCurrentUser().canView(mCase);
	}

	@Override
	public void canModify(MatrixCase mCase) throws AccessDeniedException
	{
		this.authenticationService.getCurrentUser().canModify(mCase);
	}
}
