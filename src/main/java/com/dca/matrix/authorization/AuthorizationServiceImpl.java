package com.dca.matrix.authorization;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.matrix_case.CaseAuthorityEnum;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseService;
import com.dca.matrix.user.MatrixUser;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthorizationServiceImpl implements AuthorizationService
{
	private final AuthenticationService authenticationService;

	@Override
	public void verifyUserIsSystemAdmin() throws AccessDeniedException
	{
		if (!this.authenticationService.getCurrentUser().getIsAdmin())
			throw new AccessDeniedException("User must be a system administrator for the requested action.");
	}	
	
	@Override
	public void verifyUserIsCaseAdmin(Long caseId) throws AccessDeniedException
	{
		if (!this.authenticationService.getCurrentUser().isCaseAdmin(caseId))
			throw new AccessDeniedException("You do not have administrative rights for this case.");
	}

	@Override
	public void verifyUserCanView(Long caseId) throws AccessDeniedException
	{
		if (!this.authenticationService.getCurrentUser().canView(caseId))
			throw new AccessDeniedException("You do not have the authority to view this case.");
	}

	@Override
	public void verifyUserCanModify(Long caseId) throws AccessDeniedException
	{
		if (!this.authenticationService.getCurrentUser().canModify(caseId))
			throw new AccessDeniedException("You do not have the authority to view this case.");
	}

}
