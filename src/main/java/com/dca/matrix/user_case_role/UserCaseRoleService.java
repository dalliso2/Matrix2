package com.dca.matrix.user_case_role;

public interface UserCaseRoleService
{
	UserCaseRole storeUserCaseRole(UserCaseRoleMessage ucrMessage);
	UserCaseRole deleteUserCaseRole(UserCaseRoleMessage ucrMessage);
}
