package com.dca.matrix.user_case_role;

import jakarta.validation.constraints.NotNull;

public record UserCaseRoleMessage(@NotNull Long userId,@NotNull Long caseId,@NotNull CaseRoleEnum role){}
