package com.dca.matrix.authorization;

import org.springframework.security.access.AccessDeniedException;

import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user.MatrixUser;

public interface AuthorizationService
{
	void verifyUserIsSystemAdmin() throws AccessDeniedException;
	void verifyUserIsCaseAdmin(Long caseId) throws AccessDeniedException;
	void verifyUserCanView(Long mCaseId) throws AccessDeniedException;
	void verifyUserCanModify(Long mCaseId) throws AccessDeniedException;
}
