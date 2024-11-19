package com.dca.matrix.user;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.matrix_case.CaseUserRecord;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user_case_role.UserCaseRole;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatrixUserServiceImpl implements MatrixUserService
{
	// final members will be initialized by autowiring in the generated required args constructor
	private final MatrixUserRepository MatrixUserRepository;
	private final AuthenticationService authenticationService;
	private final PasswordEncoder paswordEncoder;
	private final JdbcClient jdbcClient;

	/* 	Updates or creates the user passed in.  First checks the password
	 * 	field to see if it is null or empty.  If it is null or empty, then 
	 * 	checks to see if the user already exists.  If it does, then takes
	 * 	the existing password and puts it into the new user object and 
	 * 	stores the data.  This occurs because it is possible that an admin 
	 * 	might update a user's info without changing the password.
	 */
	@Override
	@Transactional
	public MatrixUser updateUser(MatrixUser user)
	{
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		
		if (currentUser == null)
			throw new MatrixUncheckedException("No user", null, ApiErrorCode.NOT_AUTHORIZED);
		
		// only admins can update other users
		if (!currentUser.getIsAdmin())
			throw new MatrixUncheckedException("User does not have admin role.", null, ApiErrorCode.NOT_AUTHORIZED);
		
		// check to see if user already exists
		MatrixUser existingUser = null;
		if (user.getId() != null)
			existingUser = this.MatrixUserRepository.findById(user.getId()).orElseThrow(
											()->new MatrixValidationException("User with id " + user.getId() + " does not exist.",
													null, ApiErrorCode.USER_DOES_NOT_EXIST));
		
		// cant change a user's username
		if (existingUser != null && !Objects.equals(user.getUsername(), existingUser.getUsername()))
			throw new MatrixValidationException("Cannot change the name of an existing user ("+ user.getUsername() +")",
					null, ApiErrorCode.VALIDATION_ERROR);
			
		boolean updatingSelf = Objects.equals(currentUser.getId(), existingUser!=null?existingUser.getId():null);
		
		// A user may not update their own role
		if (updatingSelf && !user.getIsAdmin().equals(currentUser.getIsAdmin()))
			throw new MatrixValidationException("User cannot update their own role.", null, ApiErrorCode.VALIDATION_ERROR);
		
		List<String> fieldErrorList = new LinkedList<String>();
		
		if (Strings.isBlank(user.getUsername()))
			fieldErrorList.add("Username cannot be blank.");

		if (Strings.isBlank(user.getFirstName()))
			fieldErrorList.add("First name cannot be blank.");

		if (Strings.isBlank(user.getLastName()))
			fieldErrorList.add("Last name cannot be blank.");

		if (existingUser == null && Strings.isBlank(user.getPassword()))
			fieldErrorList.add("Password cannot be blank.");

		if (Strings.isBlank(user.getEmail()))
			fieldErrorList.add("Email cannot be blank.");

		if (Strings.isBlank(user.getCellNumber()))
			fieldErrorList.add("Cell number cannot be blank.");

		if (Strings.isBlank(user.getWorkNumber()))
			fieldErrorList.add("Work number cannot be blank.");
		
		if (Objects.isNull(user.getEnabled()))
			fieldErrorList.add("Enabled cannot be null.");

		if (user.getAgency() == null || user.getAgency().getId() == null)
			fieldErrorList.add("Agency cannot be null.");
		
		if (fieldErrorList.size() > 0)
			throw new MatrixValidationException("Please correct the following errors:", fieldErrorList, ApiErrorCode.VALIDATION_ERROR);
			
		// If an empty password is passed in then update all other fields of the user
		// First load the existing password and set it in the object to be saved.
		String password = user.getPassword();
		if (password == null || password.trim().length() == 0)
		{
			user.setPassword(existingUser.getPassword());
		}
		else if (password.length() < MatrixUser.PASSWORD_MIN_LENGTH)
		{
			throw new MatrixValidationException("Password must be at least " + MatrixUser.PASSWORD_MIN_LENGTH + " characters in length.",
													null, ApiErrorCode.VALIDATION_ERROR);
		}
		else
		{
			user.setPassword(this.paswordEncoder.encode(user.getPassword()));
		}

		MatrixUser savedUser = this.MatrixUserRepository.save(user);
		
		return savedUser;
	}

	@Override
	public Optional<MatrixUser> findByUsername(String username)
	{
		return this.MatrixUserRepository.findByUsername(username);
	}

	@Override
	public List<MatrixUser> search(String searchString)
	{
		return this.MatrixUserRepository.searchUsers(searchString);
	}

	@Override
	public List<MatrixUser> findAll()
	{
		return this.MatrixUserRepository.findAllQuery();
	}
	
	/*
	 * Updates the password of the current user only.  Both new
	 * passwords passed must match.  The old password must be correct.
	 * 
	 * returns the id of user whose password was updated
	 */
	@Override
	@Transactional
	public MatrixUser updatePassword(ChangePasswordMessage msg)
	{
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		
		if (!Objects.equals(msg.newPassword(),msg.newPassword2()))	
			throw new MatrixValidationException("Passwords do not match.", null, ApiErrorCode.VALIDATION_ERROR);
		
		if (Strings.isBlank(msg.newPassword()) || msg.newPassword().length() < MatrixUser.PASSWORD_MIN_LENGTH)
			throw new MatrixValidationException("Password must be at least " + MatrixUser.PASSWORD_MIN_LENGTH + " characters in length.",
													null, ApiErrorCode.VALIDATION_ERROR);
		
		if (!this.paswordEncoder.matches(msg.currentPassword(),currentUser.getPassword()))
		{	
			throw new MatrixValidationException("Current password is not correct.", null, ApiErrorCode.VALIDATION_ERROR);
		}

		currentUser.setLastUpdatedBy(currentUser);
		currentUser.setPassword(this.paswordEncoder.encode(msg.newPassword()));
		this.MatrixUserRepository.save(currentUser);	
		currentUser.setPassword(MatrixUser.EMPTY_PASSWORD);
		return currentUser;
	}

	@Override
	@Transactional
	public MatrixUser setTheme(SetThemeMessage msg)
	{
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		currentUser.setDarkTheme(msg.darkTheme());
		
		return this.MatrixUserRepository.save(currentUser);
	}

	@Override
	public MatrixUser findById(Long id)
	{
		return this.MatrixUserRepository.findById(id).orElseThrow(()-> 
			new MatrixUncheckedException("User id " + id + " not found.",null, ApiErrorCode.USER_DOES_NOT_EXIST));
	}

	@Override
	public List<UserCaseRecord> getUserCaseRecords()
	{
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		StringBuilder sql = new StringBuilder("select " + MatrixCase.TABLE + "." + MatrixCase.ID + ","
												+ MatrixCase.TABLE + "." + MatrixCase.CASE_NUMBER + ","
												+ MatrixCase.TABLE + "." + MatrixCase.CASE_TITLE + ","
												+ MatrixCase.TABLE + "." + MatrixCase.CASE_DESCRIPTION + ","
												+ UserCaseRole.TABLE + "." + UserCaseRole.ROLE
												+ " from " + MatrixCase.TABLE + "," + UserCaseRole.TABLE + "," + MatrixUser.TABLE
												+ " where " + MatrixCase.TABLE + "." + MatrixCase.ID + "=" + UserCaseRole.TABLE + "." + UserCaseRole.CASE_ID 
												+ " and " + MatrixUser.TABLE + "." + MatrixUser.ID + "=" + UserCaseRole.TABLE + "." +UserCaseRole.USER_ID
												+ " and " + MatrixUser.TABLE + "." + MatrixUser.ID + "=" + currentUser.getId()
												+ " order by " + MatrixCase.TABLE + "." + MatrixCase.CASE_NUMBER);
												
		
		
		return this.jdbcClient.sql(sql.toString()).query((resultSet, rowNum)->
					new UserCaseRecord(resultSet.getLong(1),
										resultSet.getString(2),
										resultSet.getString(3),
										resultSet.getString(4),
										resultSet.getLong(5))).list();
	}
}
