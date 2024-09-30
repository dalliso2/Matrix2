package com.dca.matrix.matrix_case;

import java.util.List;

import com.dca.matrix.user_case_role.CaseRoleEnum;

public interface MatixCaseService
{
	MatrixCase createUpdateCase(MatrixCase matrixCase);
	MatrixCase getCase(Long caseId);
	MatrixCase addUpdateUser(Long userId, Long caseId, CaseRoleEnum role);
	MatrixCase removeUser(Long userId, Long caseId);
	List<CaseUserRecord> getUserList(Long caseId);
}
