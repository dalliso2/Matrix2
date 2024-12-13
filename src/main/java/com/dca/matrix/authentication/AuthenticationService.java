package com.dca.matrix.authentication;

import com.dca.matrix.user.MatrixUser;

public interface AuthenticationService
{
	MatrixUser getCurrentUser();
}
