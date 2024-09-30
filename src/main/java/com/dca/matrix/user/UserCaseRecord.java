package com.dca.matrix.user;

import com.dca.matrix.user_case_role.CaseRoleEnum;

public record UserCaseRecord(Long id, String caseNumber, String title, String description, Long role){}
