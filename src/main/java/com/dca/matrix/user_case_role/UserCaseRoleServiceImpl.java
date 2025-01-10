package com.dca.matrix.user_case_role;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;
import com.dca.matrix.matrix_case.MatrixCaseService;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserRepository;
import com.dca.matrix.user.MatrixUserService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCaseRoleServiceImpl implements UserCaseRoleService
{
//	private final UserCaseRoleRepository ucrRepository;
//	private final MatrixUserService userService;
//	private final MatrixCaseService caseService;
//	private final AuthenticationService authenticationService;
//	private final AuthorizationService authorizationService;
//
//	@Override
//	public UserCaseRole storeUserCaseRole(UserCaseRoleMessage ucrMessage)
//	{		
//		MatrixCase theCase = this.caseService.getCase(ucrMessage.caseId());
//		MatrixUser user = this.authenticationService.getCurrentUser();
//		
//		// if role being assigned is case owner, make sure the current user is a system admin
//		if (ucrMessage.roleId().equals(CaseRoleEnum.Admin))
//		{
//			if (!user.getIsAdmin())
//				throw new AccessDeniedException("Only system admins can reassign case admin role.");
//		}
//		// otherwise make sure current user is a case owner
//		else
//			user.isCaseAdmin(theCase);
//		
//		UserCaseRole ucr = null;
//		Optional<UserCaseRole> existingUcrOpt = this.ucrRepository.findById(new UserCaseKey(ucrMessage.userId(), ucrMessage.caseId()));
//		if (existingUcrOpt.isPresent())
//		{
//			ucr = existingUcrOpt.get();
//			ucr.setCaseRole(ucrMessage.roleId());
//		}
//		else
//		{
//			MatrixUser mUser = this.userService.findById(ucrMessage.userId());
//			ucr = new UserCaseRole(mUser, theCase, ucrMessage.roleId());
//		}
//		
//		return this.ucrRepository.save(ucr);
//	}
//
//	@Override
//	public UserCaseRole deleteUserCaseRole(Long caseId, Long userId)
//	{
//		UserCaseRole ucr = null;
//		// load case
//		MatrixCase mCase = this.caseService.getCase(ucrMessage.caseId());
//		
//		// ensure current user is a system admin or a case owner
//		MatrixUser currentUser = this.authenticationService.getCurrentUser();
//		currentUser.isCaseAdmin(mCase);
//
//		Optional<UserCaseRole> existingUcrOpt = this.ucrRepository.findById(new UserCaseKey(ucrMessage.userId(), ucrMessage.caseId()));
//		if (existingUcrOpt.isPresent())
//		{
//			ucr = existingUcrOpt.get();
//			this.ucrRepository.delete(ucr);
//		}
//		else
//			throw new MatrixUncheckedException("User " + ucrMessage.userId() + " has no role in case " + mCase.getCaseNumber(),
//												null, ApiErrorCode.USER_NOT_ASSIGNED_TO_CASE);
//
//		return ucr;
//	}
	
//	@Override
//	public UserCaseRole setCaseOwner(UserCaseRoleMessage ucrMessage)
//	{		
//		// make sure current user is an admin
//		this.authorizationService.verifyUserIsAdmin();
//		
//		MatrixCase theCase = this.caseService.getCase(ucrMessage.caseId());
//		MatrixUser user = this.authenticationService.getCurrentUser();
//		
//		// check and see if the user already has a role in this case
//		
//		this.ucrRepository.
//		
//		UserCaseRole ucr = null;
//		Optional<UserCaseRole> existingUcrOpt = this.ucrRepository.findById(new UserCaseKey(ucrMessage.userId(), ucrMessage.caseId()));
//		if (existingUcrOpt.isPresent())
//		{
//			ucr = existingUcrOpt.get();
//			ucr.setCaseRole(ucrMessage.roleId());
//		}
//		else
//		{
//			MatrixUser mUser = this.userService.findById(ucrMessage.userId());
//			ucr = new UserCaseRole(mUser, theCase, ucrMessage.roleId());
//		}
//		
//		return this.ucrRepository.save(ucr);
//	}
}
