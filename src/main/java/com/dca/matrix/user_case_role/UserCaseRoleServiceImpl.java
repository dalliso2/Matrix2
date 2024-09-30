package com.dca.matrix.user_case_role;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;
import com.dca.matrix.user.AuthenticationService;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserCaseRoleServiceImpl implements UserCaseRoleService
{
	private final UserCaseRoleRepository ucrRepository;
	private final MatrixUserRepository matrixUserRepository;
	private final MatrixCaseRepository matrixCaseRepository;
	private final AuthenticationService authenticationService;

	@Override
	@Transactional
	public UserCaseRole storeUserCaseRole(UserCaseRoleMessage ucrMessage)
	{		
		// load case
		MatrixCase mCase = this.matrixCaseRepository.findById(ucrMessage.caseId())
				.orElseThrow(()-> new MatrixUncheckedException("Case " + ucrMessage.caseId() + " not found.",
																null, ApiErrorCode.CASE_DOES_NOT_EXIST));
		
		// ensure current user is a system admin or a case owner
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		if (!currentUser.isCaseOwner(mCase))
					throw new MatrixUncheckedException("User " + currentUser.getUsername() 
															+ " is not authorized to edit case " 
															+ ucrMessage.caseId(),
															null, ApiErrorCode.NOT_AUTHORIZED);
		
		UserCaseRole ucr = null;
		Optional<UserCaseRole> existingUcrOpt = this.ucrRepository.findById(new UserCaseKey(ucrMessage.userId(), ucrMessage.caseId()));
		if (existingUcrOpt.isPresent())
		{
			ucr = existingUcrOpt.get();
			ucr.setCaseRole(ucrMessage.role());
		}
		else
		{
			MatrixUser mUser = this.matrixUserRepository.findById(ucrMessage.userId())
									.orElseThrow(()-> new MatrixUncheckedException("User " + ucrMessage.userId() + " not found.",
																					null, ApiErrorCode.USER_DOES_NOT_EXIST));

			ucr = new UserCaseRole(mUser, mCase, ucrMessage.role());
		}
		return this.ucrRepository.save(ucr);
	}

	@Override
	public UserCaseRole deleteUserCaseRole(UserCaseRoleMessage ucrMessage)
	{
		UserCaseRole ucr = null;
		// load case
		MatrixCase mCase = this.matrixCaseRepository.findById(ucrMessage.caseId())
				.orElseThrow(()-> new MatrixUncheckedException("Case " + ucrMessage.caseId() + " not found.",
																null, ApiErrorCode.CASE_DOES_NOT_EXIST));
		
		// ensure current user is a system admin or a case owner
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		if (!currentUser.isCaseOwner(mCase))
			throw new MatrixUncheckedException("User " + currentUser.getUsername() + " is not authorized to edit case " 
												+ ucrMessage.caseId(),null, ApiErrorCode.NOT_AUTHORIZED);


		Optional<UserCaseRole> existingUcrOpt = this.ucrRepository.findById(new UserCaseKey(ucrMessage.userId(), ucrMessage.caseId()));
		if (existingUcrOpt.isPresent())
		{
			ucr = existingUcrOpt.get();
			this.ucrRepository.delete(ucr);
		}
		else
			throw new MatrixUncheckedException("User " + ucrMessage.userId() + " has no role in case " + mCase.getCaseNumber(),
												null, ApiErrorCode.USER_NOT_ASSIGNED_TO_CASE);

		return ucr;
	}
}
