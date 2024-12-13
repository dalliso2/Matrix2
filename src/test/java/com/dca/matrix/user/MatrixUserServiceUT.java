package com.dca.matrix.user;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.Mockito.*;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dca.matrix.agency.Agency;
import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.exception.MatrixUncheckedException;

class MatrixUserServiceUT
{
	private MatrixUserService userService;
	private AuthenticationService authenticationService;
	private MatrixUserRepository matrixUserRepository;
	private PasswordEncoder passwordEncoder;
	private JdbcClient jdbcClient;
		
	private MatrixUser currentUser;
	private MatrixUser testUser;
	private MatrixUser testUser2;
	
	@BeforeEach
	void setUp() throws Exception
	{
		this.matrixUserRepository = mock(MatrixUserRepository.class);
		this.authenticationService = mock(AuthenticationService.class);
		this.passwordEncoder = new BCryptPasswordEncoder();
		this.jdbcClient = mock(JdbcClient.class);
		this.userService = new MatrixUserServiceImpl(this.matrixUserRepository, 
														this.authenticationService, 
														this.passwordEncoder,
														this.jdbcClient);
		
		assertNotNull(this.matrixUserRepository);
		assertNotNull(this.authenticationService);
		assertNotNull(this.passwordEncoder);
		assertNotNull(this.jdbcClient);
		assertNotNull(this.userService);
		
		Agency agency = new Agency();
		agency.setId(1L);
		
		this.currentUser = new MatrixUser();
		this.currentUser.setId(1L);
		this.currentUser.setUsername("currentUser");
		this.currentUser.setPassword(this.passwordEncoder.encode("abcdefgh"));
		this.currentUser.setLastName("User1");
		this.currentUser.setFirstName("Existing1");
		this.currentUser.setEmail("asdf@asdf.com");
		this.currentUser.setWorkNumber("123-123-1234");
		this.currentUser.setCellNumber("123-123-1234");
		this.currentUser.setEnabled(true);
		this.currentUser.setAgency(agency);
		this.currentUser.setIsAdmin(true);
		this.currentUser.setCreateTime(new Date());
		this.currentUser.setLastUpdateTime(new Date());
		this.currentUser.setExistingUser(true);
		
		this.testUser = new MatrixUser();
		this.testUser.setId(10L);
		this.testUser.setUsername("NEWUSER");
		this.testUser.setPassword(this.passwordEncoder.encode("12345678"));
		this.testUser.setFirstName("firstname");
		this.testUser.setLastName("lastname");
		this.testUser.setEmail("asdf@asdf.com");
		this.testUser.setWorkNumber("123-123-1234");
		this.testUser.setCellNumber("123-123-1234");
		this.testUser.setEnabled(true);
		this.testUser.setAgency(agency);
		this.testUser.setIsAdmin(false);
		this.testUser.setEnabled(true);
		
		this.testUser2 = new MatrixUser();
		this.testUser2.setId(20L);
		this.testUser2.setUsername("NEWUSER2");
		this.testUser2.setPassword(this.passwordEncoder.encode("12345678"));
		this.testUser2.setFirstName("firstname");
		this.testUser2.setLastName("lastname");
		this.testUser2.setEmail("asdf@asdf.com");
		this.testUser2.setWorkNumber("123-123-1234");
		this.testUser2.setCellNumber("123-123-1234");
		this.testUser2.setEnabled(true);
		this.testUser2.setAgency(agency);
		this.testUser2.setIsAdmin(false);
		this.testUser2.setEnabled(true);
	}
	
	@Test
	void updateUser_GIVEN_noCurrentUser_THEN_matrixException()
	{
		when(this.matrixUserRepository.findById(anyLong())).thenReturn(Optional.ofNullable(null));
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updateUser(this.testUser));
		assertEquals("user_service_000",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updateUser_GIVEN_idNotNullButUserDoesntExist_THEN_matrixException010()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		when(this.matrixUserRepository.findById(anyLong())).thenReturn(Optional.ofNullable(null));
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updateUser(this.testUser));
		assertEquals("user_service_010",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updateUser_GIVEN_changedUsername_THEN_matrixException020()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		when(this.matrixUserRepository.findById(anyLong())).thenReturn(Optional.ofNullable(this.testUser));
		
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updateUser(this.testUser2));
		assertEquals("user_service_020", thrown.getAPIError().errorCode());
	}
	
	@Test
	void updateUser_GIVEN_nonAdminUserUpdatingOther_THEN_matrixException005()
	{
		this.currentUser.setIsAdmin(false);
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updateUser(this.testUser));
		assertEquals("user_service_005",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updateUser_GIVEN_userChangingOwnAdminStatus_THEN_matrixException030()
	{
		this.currentUser.setIsAdmin(true);
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
	
		MatrixUser updatedCurrentUser = new MatrixUser();
		updatedCurrentUser.setId(this.currentUser.getId());
		updatedCurrentUser.setIsAdmin(false);
		
		when(this.matrixUserRepository.findById(anyLong())).thenReturn(Optional.ofNullable(updatedCurrentUser));
		
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updateUser(updatedCurrentUser));
		assertEquals("user_service_030",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updateUser_GIVEN_blankFields_THEN_matrixException040()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
	
		MatrixUser tempUser = new MatrixUser();
		
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updateUser(tempUser));
		assertEquals("user_service_040",thrown.getAPIError().errorCode());
		assertEquals(8, thrown.getAPIError().errors().size());
	}
	
	@Test
	void updateUser_GIVEN_passwordLessThan8Chars_THEN_matrixException060()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);

		this.testUser2.setId(this.testUser.getId());
		this.testUser2.setUsername(this.testUser.getUsername());
		this.testUser2.setPassword("1234567");
		when(this.matrixUserRepository.findById(anyLong())).thenReturn(Optional.ofNullable(this.testUser));
		
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updateUser(this.testUser2));
		assertEquals("user_service_060",thrown.getAPIError().errorCode());
	}
	
	void updateUserSuccessfulSetup()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);

		when(this.matrixUserRepository.findById(anyLong())).thenReturn(Optional.ofNullable(this.testUser));
		this.testUser2.setId(this.testUser.getId());
		this.testUser2.setUsername(this.testUser.getUsername());
		this.testUser2.setCellNumber("321-321-3213");
		
		when(this.matrixUserRepository.save(any())).thenReturn(this.testUser2);		
	}
	
	@Test
	void updateUser_GIVEN_updateSuccessful_THEN_noException()
	{
		updateUserSuccessfulSetup();
		assertDoesNotThrow(()->this.userService.updateUser(this.testUser2));
	}
	
	@Test
	void updateUser_GIVEN_updateSuccessful_THEN_verifyGetCurrentUserCalled()
	{
		updateUserSuccessfulSetup();
		this.userService.updateUser(this.testUser2);
		verify(this.authenticationService,times(1)).getCurrentUser();
	}
	
	@Test
	void updateUser_GIVEN_updateSuccessful_THEN_repositorySaveCalled()
	{
		updateUserSuccessfulSetup();
		this.userService.updateUser(this.testUser2);
		verify(this.matrixUserRepository,times(1)).save(this.testUser2);
	}
	
//	@Test
//	void updateUser_GIVEN_updateSuccessful_THEN_repositorySaveCalledWithEncryptedPassword()
//	{
//		ArgumentCaptor<MatrixUser> mUserCaptor = ArgumentCaptor.forClass(MatrixUser.class);
//
//		updateUserSuccessfulSetup();
//		String password = "password123";
//		this.testUser2.setPassword(password);
//		this.userService.updateUser(this.testUser2);
//
//		verify(this.matrixUserRepository).save(mUserCaptor.capture());
//		assertTrue(this.passwordEncoder.matches(password, mUserCaptor.getValue().getPassword()));
//	}
	
	@Test
	void updateUser_GIVEN_updateSuccessful_THEN_emptyPasswordReturned()
	{
		updateUserSuccessfulSetup();
		MatrixUser updatedUser = this.userService.updateUser(this.testUser2);
		assertEquals(MatrixUser.EMPTY_PASSWORD, updatedUser.getPassword());
	}
	
	@Test
	void updatePassword_GIVEN_passwordsDontMatch_THEN_matrixException420()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);

		ChangePasswordMessage cpm = new ChangePasswordMessage("oldPassword","newPassword","differenPassword");
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updatePassword(cpm));
		
		assertEquals("user_service_420",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updatePassword_GIVEN_newPasswordBlank_THEN_matrixException420()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);

		ChangePasswordMessage cpm = new ChangePasswordMessage("oldPassword","","");
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updatePassword(cpm));
		
		assertEquals("user_service_430",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updatePassword_GIVEN_newPasswordTooShort_THEN_matrixException420()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);

		ChangePasswordMessage cpm = new ChangePasswordMessage("oldPassword","newPass","newPass");
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updatePassword(cpm));
		
		assertEquals("user_service_430",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updatePassword_GIVEN_currentPasswordIncorrect_THEN_matrixException420()
	{
		String currentPassword = "currentPassword";
		String currentPasswordEncoded = this.passwordEncoder.encode(currentPassword);
		String newPassword = "newPassword";
		
		this.currentUser.setPassword(currentPasswordEncoded);
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		ChangePasswordMessage cpm = new ChangePasswordMessage(currentPassword+"123", newPassword, newPassword);
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class,()->this.userService.updatePassword(cpm));
		
		assertEquals("user_service_440",thrown.getAPIError().errorCode());
	}
	
	@Test
	void updatePassword_GIVEN_updateSuccessful_THEN_noException()
	{
		String currentPassword = "currentPassword";
		String currentPasswordEncoded = this.passwordEncoder.encode(currentPassword);
		String newPassword = "newPassword";
		
		this.currentUser.setPassword(currentPasswordEncoded);
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		ChangePasswordMessage cpm = new ChangePasswordMessage(currentPassword, newPassword, newPassword);
		assertDoesNotThrow(()->this.userService.updatePassword(cpm));
	}

	@Test
	void updatePassword_GIVEN_updateSuccessful_THEN_repositorySaveCalled()
	{
		String currentPassword = "currentPassword";
		String currentPasswordEncoded = this.passwordEncoder.encode(currentPassword);
		String newPassword = "newPassword";
		
		this.currentUser.setPassword(currentPasswordEncoded);
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		ChangePasswordMessage cpm = new ChangePasswordMessage(currentPassword, newPassword, newPassword);
		
		this.userService.updatePassword(cpm);
		
		verify(this.matrixUserRepository,times(1)).save(this.currentUser);
	}
	
	@Test
	void updatePassword_GIVEN_updateSuccessful_THEN_blankPasswordReturned()
	{
		String currentPassword = "currentPassword";
		String currentPasswordEncoded = this.passwordEncoder.encode(currentPassword);
		String newPassword = "newPassword";
		
		this.currentUser.setPassword(currentPasswordEncoded);
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		ChangePasswordMessage cpm = new ChangePasswordMessage(currentPassword, newPassword, newPassword);
		MatrixUser user = this.userService.updatePassword(cpm);
		assertEquals(MatrixUser.EMPTY_PASSWORD, user.getPassword());
	}
	
	@Test
	void updatePassword_GIVEN_updateSuccessful_THEN_respositorySaveCalled()
	{
		String currentPassword = "currentPassword";
		String currentPasswordEncoded = this.passwordEncoder.encode(currentPassword);
		String newPassword = "newPassword";
		
		this.currentUser.setPassword(currentPasswordEncoded);
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		ChangePasswordMessage cpm = new ChangePasswordMessage(currentPassword, newPassword, newPassword);
		this.userService.updatePassword(cpm);

		verify(this.matrixUserRepository,times(1)).save(this.currentUser);
	}
	
	@Test
	void setTheme_GIVEN_updateSuccessful_THEN_respositorySaveCalled()
	{
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		SetThemeMessage stm = new SetThemeMessage(true);
		this.userService.setTheme(stm);

		verify(this.matrixUserRepository,times(1)).save(this.currentUser);
	}
	
	@Test
	void setTheme_GIVEN_updateSuccessful_THEN_respositorySaveCalledWithCorrectTheme1()
	{
		ArgumentCaptor<MatrixUser> mUserCaptor = ArgumentCaptor.forClass(MatrixUser.class);
		
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		SetThemeMessage stm = new SetThemeMessage(true);
		this.userService.setTheme(stm);

		verify(this.matrixUserRepository).save(mUserCaptor.capture());
		assertTrue(mUserCaptor.getValue().getDarkTheme());
	}
	
	@Test
	void setTheme_GIVEN_updateSuccessful_THEN_respositorySaveCalledWithCorrectTheme2()
	{
		ArgumentCaptor<MatrixUser> mUserCaptor = ArgumentCaptor.forClass(MatrixUser.class);
		
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
		
		SetThemeMessage stm = new SetThemeMessage(false);
		this.userService.setTheme(stm);

		verify(this.matrixUserRepository).save(mUserCaptor.capture());
		assertFalse(mUserCaptor.getValue().getDarkTheme());
	}
	
//	@Test
//	void updatePassword_GIVEN_updateSuccessful_THEN_encryptedPasswordSaved()
//	{
//		ArgumentCaptor<MatrixUser> mUserCaptor = ArgumentCaptor.forClass(MatrixUser.class);
//
//		String currentPassword = "currentPassword";
//		String currentPasswordEncoded = this.passwordEncoder.encode(currentPassword);
//		String newPassword = "newPassword";
//		
//		// set encrypted password that would be loaded from database
//		this.currentUser.setPassword(currentPasswordEncoded);
//		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
//		
//		ChangePasswordMessage cpm = new ChangePasswordMessage(currentPassword, newPassword, newPassword);
//		this.userService.updatePassword(cpm);
//
//		verify(this.matrixUserRepository).save(mUserCaptor.capture());
//		assertTrue(this.passwordEncoder.matches(newPassword, mUserCaptor.getValue().getPassword()));
//	}
	
	
}
