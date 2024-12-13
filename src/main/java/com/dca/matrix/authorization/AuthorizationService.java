package com.dca.matrix.authorization;

import org.springframework.security.access.AccessDeniedException;

import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user.MatrixUser;

public interface AuthorizationService
{
	void canView(MatrixCase mCase) throws AccessDeniedException;
	void canModify(MatrixCase mCase) throws AccessDeniedException;
}
