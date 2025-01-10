package com.dca.matrix.user_case_role;

import jakarta.validation.constraints.NotNull;
import com.dca.matrix.user_case_role.*;

public record UserCaseRoleMessage(@NotNull Long userId,@NotNull Long caseId,@NotNull CaseRoleEnum roleId)
{
	public UserCaseRoleMessage(UserCaseRole ucr)
	{
		this(ucr.getUser().getId(), ucr.getMatrixCase().getId(), ucr.getCaseRole());
	}
}
