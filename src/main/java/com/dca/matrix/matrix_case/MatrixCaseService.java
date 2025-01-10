package com.dca.matrix.matrix_case;

import java.util.List;
import java.util.Optional;

import com.dca.matrix.user_case_role.CaseRoleEnum;
import com.dca.matrix.user_case_role.UserCaseRole;

public interface MatrixCaseService
{
	MatrixCase createUpdateCase(MatrixCase matrixCase);
	MatrixCase getCase(Long caseId);
	List<MatrixCase> search(String searchText);
	UserCaseRole addUpdateUserToCase(Long userId, Long caseId, CaseRoleEnum role);
	UserCaseRole removeUser(Long userId, Long caseId);
	List<CaseUserRecord> getUserList(Long caseId);
	Optional<MatrixCase> getCaseOpt(Long caseId);
}
