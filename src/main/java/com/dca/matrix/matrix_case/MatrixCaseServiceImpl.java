package com.dca.matrix.matrix_case;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserRepository;
import com.dca.matrix.user.MatrixUserService;
import com.dca.matrix.user_case_role.CaseRoleEnum;
import com.dca.matrix.user_case_role.UserCaseKey;
import com.dca.matrix.user_case_role.UserCaseRole;
import com.dca.matrix.user_case_role.UserCaseRoleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MatrixCaseServiceImpl implements MatrixCaseService
{
	private final AuthenticationService authenticationService;
	private final AuthorizationService authorizationService;
	private final MatrixCaseRepository matrixCaseRepository;
	//private final MatrixUserRepository matrixUserRepository;
	private final MatrixUserService matrixUserService;
	private final UserCaseRoleRepository userCaseRoleRepository;
	private final MatrixUserRepository userRepository;
	private final JdbcClient jdbcClient;
	
	@Override
	public MatrixCase createUpdateCase(final MatrixCase matrixCase)
	{
		MatrixUser currentUser = this.authenticationService.getCurrentUser();

		MatrixCase existingCaseForId = null;
		if (matrixCase.getId() !=null)
		{
			existingCaseForId = this.matrixCaseRepository.findById(matrixCase.getId()).orElseThrow(()->
										new MatrixValidationException("Case with id " + matrixCase.getId() + " does not exist.",
												null, ApiErrorCode.CASE_DOES_NOT_EXIST));
			
			matrixCase.setCreatedBy(existingCaseForId.getCreatedBy());
			matrixCase.setCreateTime(existingCaseForId.getCreateTime());
		}
		
		// if case already exists
		// check to see if the current user is the owner.  If not throw exception 
//		if (existingCaseForId != null && existingCaseForId.getUserCaseRoles().stream().noneMatch(ucr->
//										(ucr.getUser().getId()==currentUser.getId() && 
//											ucr.getCaseRole().equals(CaseRoleEnum.Owner))))
//			throw new MatrixValidationException("Only case owner may update a case.",
//					null, ApiErrorCode.NOT_AUTHORIZED);		
		// check to make sure user can edit case
		if (existingCaseForId != null && !currentUser.getIsAdmin())
		{
			this.authorizationService.verifyUserIsCaseAdmin(matrixCase.getId());
		}
		
		Optional<MatrixCase> existingCaseForNumberOpt = this.matrixCaseRepository.findByCaseNumber(matrixCase.getCaseNumber());
		
		// verify that the case number isn't the same as that of another existing case
		if (existingCaseForNumberOpt.isPresent() && !Objects.equals(existingCaseForNumberOpt.get().getId(), matrixCase.getId()))
			throw new MatrixValidationException("A case with number " + matrixCase.getCaseNumber() + " already exists.",
													null, ApiErrorCode.DUPLICATE_PRIMARY_KEY);		
		
		// check that all fields are valid
		List<String> fieldErrorList = new LinkedList<>();
		
		if (Strings.isBlank(matrixCase.getCaseNumber()))
			fieldErrorList.add("Case number cannot be blank.");

		if (Strings.isBlank(matrixCase.getTitle()))
			fieldErrorList.add("Case title cannot be blank.");

		if (fieldErrorList.size() > 0)
			throw new MatrixValidationException("Please correct the following errors:", fieldErrorList, ApiErrorCode.FIELD_VALIDATION_ERROR);
		
		// create case
		MatrixCase updatedCase = this.matrixCaseRepository.save(matrixCase);
		
		// if new case set the current user to the owner
		if (existingCaseForId == null)
		{
			UserCaseRole ucr = new UserCaseRole(this.userRepository.findById(currentUser.getId()).get(), updatedCase, CaseRoleEnum.Admin);
			this.userCaseRoleRepository.save(ucr);
		}
		
		return matrixCase;
	}

	@Override
	public UserCaseRole addUpdateUserToCase(Long userId, Long caseId, CaseRoleEnum role)
	{
		MatrixCase matrixCase = this.matrixCaseRepository.findById(caseId).orElseThrow(()->
										new MatrixValidationException("Specified case with id " + caseId + " does not exist.",
												null, ApiErrorCode.CASE_DOES_NOT_EXIST));
		
		// if the role being assigned is the case owner then make sure the current user is a system admin
		if (role.equals(CaseRoleEnum.Admin))
			this.authorizationService.verifyUserIsSystemAdmin();
		// else other role is being assigned so verify that the current user is a system admin or case owner
		else
			this.authorizationService.verifyUserIsCaseAdmin(caseId);
		
		// load the users current role, if any
		Optional<UserCaseRole> ucrOpt = this.userCaseRoleRepository.findById(new UserCaseKey(userId, caseId));
		
		// if a role exists for the user then update it
		if (ucrOpt.isPresent())
		{
			UserCaseRole ucr = ucrOpt.get();
			ucr.setCaseRole(role);
			return this.userCaseRoleRepository.save(ucr);
		}
		// if no role exists then create it
		else
		{
			UserCaseRole ucr = new UserCaseRole();
			ucr.setUser(this.matrixUserService.findById(userId));
			ucr.setMatrixCase(matrixCase);
			ucr.setCaseRole(role);
			return this.userCaseRoleRepository.save(ucr);
		}
	}

	@Override
	public UserCaseRole removeUser(Long userId, Long caseId)
	{
		UserCaseRole ucr = this.userCaseRoleRepository.findById(new UserCaseKey(userId, caseId))
				.orElseThrow(()->new MatrixValidationException("User was not assigned to specified case.",
						null, ApiErrorCode.USER_NOT_ASSIGNED_TO_CASE));
		
		// if the role being removed is the case admin then make sure the current user is a system admin
		if (ucr.getCaseRole().equals(CaseRoleEnum.Admin))
			this.authorizationService.verifyUserIsSystemAdmin();
		// else other role is being assigned so verify that the current user is a system admin or case owner
		else
			this.authorizationService.verifyUserIsCaseAdmin(caseId);
		
		this.userCaseRoleRepository.delete(ucr);
		
		return ucr;
	}

	@Override
	public List<CaseUserRecord> getUserList(Long caseId)
	{
		StringBuilder sql = new StringBuilder("select " + MatrixCase.TABLE + "." + MatrixCase.ID + ","
												+ MatrixUser.TABLE + "." + MatrixUser.ID + ","
												+ UserCaseRole.TABLE + "." + UserCaseRole.ROLE + ","
												+ MatrixUser.TABLE + "." + MatrixUser.USERNAME + ","
												+ MatrixUser.TABLE + "." + MatrixUser.LAST_NAME + ","
												+ MatrixUser.TABLE + "." + MatrixUser.FIRST_NAME + ","
												+ MatrixUser.TABLE + "." + MatrixUser.PROFILE_IMAGE_ID + ","
												+ MatrixUser.TABLE + "." + MatrixUser.ENABLED
												+ " from " + MatrixCase.TABLE + "," + UserCaseRole.TABLE + "," + MatrixUser.TABLE
												+ " where " + MatrixCase.TABLE + "." + MatrixCase.ID + "=" + UserCaseRole.TABLE + "." + UserCaseRole.CASE_ID 
												+ " and " + MatrixUser.TABLE + "." + MatrixUser.ID + "=" + UserCaseRole.TABLE + "." +UserCaseRole.USER_ID
												+ " and " + MatrixCase.TABLE + "." + MatrixCase.ID + "=" + caseId);
												
		
		
		return this.jdbcClient.sql(sql.toString()).query((resultSet, rowNum)->
					new CaseUserRecord(resultSet.getLong(1),
										resultSet.getLong(2),
										resultSet.getLong(3),
										resultSet.getString(4),
										resultSet.getString(5),
										resultSet.getString(6),
										resultSet.getLong(7),
										resultSet.getBoolean(8))).list();
	}

	@Override
	public MatrixCase getCase(Long caseId)
	{
		MatrixCase mCase = this.matrixCaseRepository.findById(caseId).orElseThrow(()->
											new MatrixValidationException("Case with id " + caseId + " does not exist.",
													null, ApiErrorCode.CASE_DOES_NOT_EXIST));
		// verify current user has access to this case
		this.authenticationService.getCurrentUser().canView(mCase.getId());
		
		return mCase;
	}

	@Override
	public Optional<MatrixCase> getCaseOpt(Long caseId)
	{
		return this.matrixCaseRepository.findById(caseId);
	}
	
	@Override
	public List<MatrixCase> search(String searchText)
	{
		return this.matrixCaseRepository.searchCases(searchText);
	}	
}
