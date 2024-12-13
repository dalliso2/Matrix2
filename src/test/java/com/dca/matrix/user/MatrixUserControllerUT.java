package com.dca.matrix.user;
 
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

import java.util.Date;
import java.util.LinkedList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.security.SecurityConfig;
import com.fasterxml.jackson.databind.ObjectMapper;

@Import(SecurityConfig.class)
@WebMvcTest(MatrixUserController.class)
public class MatrixUserControllerUT
{
	@Autowired
	private MockMvc mockMvc;
	@MockBean
	private MatrixUserService matrixUserService;
	@MockBean
	private MatrixUserRepository userRepository;
	@MockBean
	private AuthenticationService authenticationService;
	
	private ObjectMapper mapper = new ObjectMapper();
	
	private MatrixUser vstUser1;
	private MatrixUser vstUser2;
	private MatrixUser vstUser3;
	private LinkedList<MatrixUser> userList;

	//
	// All methods should redirect to login if no authenticated user
	//

	@ParameterizedTest(name = "Status should be redirect for get request to {0} when no authenticated user.")
	@ValueSource(strings = {"/api/user/all","/api/user/current","/api/user/1","/api/user/search","/api/user/case_list"})
	void allGetMethods_GIVEN_noAuthenticatedUser_THEN_statusRedirect(String uri) throws Exception
	{
		this.mockMvc.perform(get(uri).contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON))
													.andExpect(status().is3xxRedirection());
	}
	
	@ParameterizedTest(name = "Status should be redirect for post to {0} when no authenticated user.")
	@ValueSource(strings = {"/api/user/store"})
	void allPostMethods_GIVEN_noAuthenticatedUser_THEN_statusRedirect(String uri) throws Exception
	{
		this.mockMvc.perform(post(uri).contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON))
													.andExpect(status()
													.is3xxRedirection());
	}

	@ParameterizedTest(name = "Status should be redirect for patch to {0} when no authenticated user.")
	@ValueSource(strings = {"/api/user/password","/api/user/theme"})
	void allPatchMethods_GIVEN_noAuthenticatedUser_THEN_statusRedirect(String uri) throws Exception
	{
		this.mockMvc.perform(patch(uri).contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON))
													.andExpect(status()
													.is3xxRedirection());
	}
	
	//
	// All authenticated users should be able to retrieve user information
	//
	
	@ParameterizedTest(name = "Status should be OK for get request to {0} with authenticated user.")
	@ValueSource(strings = {"/api/user/all","/api/user/current","/api/user/1","/api/user/search/a","/api/user/case_list"})
	@WithMockUser
	void allGetMethods_GIVEN_authenticatedUser_THEN_statusOK(String uri) throws Exception
	{
		this.mockMvc.perform(get(uri).contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON))
													.andExpect(status().isOk());
	}
	
	@ParameterizedTest(name = "Status should be OK for post to {0} with authenticated user.")
	@ValueSource(strings = {"/api/user/store"})
	@WithMockUser(roles="ADMIN")
	void allPostMethods_GIVEN_adminUser_THEN_statusOK(String uri) throws Exception
	{
		this.mockMvc.perform(post(uri).contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content("{}"))
													.andExpect(status().isOk());
	}

	@ParameterizedTest(name = "Status should be OK for patch to {0} with authenticated user.")
	@ValueSource(strings = {"/api/user/password","/api/user/theme"})
	@WithMockUser
	void allPatchMethods_GIVEN_authenticatedUser_THEN_statusOK(String uri) throws Exception
	{
		this.mockMvc.perform(patch(uri).contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content("{}"))
													.andExpect(status().isOk());
	}
	
	@Test
	@WithMockUser
	void getAll_GIVEN_authenticatedUser_THEN_callsUserServiceFindAll() throws Exception
	{
		this.mockMvc.perform(get("/api/user/all").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status()
				.isOk());
		
		verify(this.matrixUserService,times(1)).findAll();
	}
	
	@Test
	@WithMockUser
	void getCurrentUser_GIVEN_authenticatedUser_THEN_callsAuthenticiationServiceGetCurrentUser() throws Exception
	{
		this.mockMvc.perform(get("/api/user/current").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status()
				.isOk());
		
		verify(this.authenticationService,times(1)).getCurrentUser();
	}
	
	@Test
	@WithMockUser
	void loadUser_GIVEN_authenticatedUser_THEN_callsUserServiceFindById() throws Exception
	{
		this.mockMvc.perform(get("/api/user/12").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status()
				.isOk());
		
		verify(this.matrixUserService,times(1)).findById(12L);
	}
	
	@Test
	@WithMockUser
	void searchUsers_GIVEN_authenticatedUser_THEN_callsUserServiceSearch() throws Exception
	{
		this.mockMvc.perform(get("/api/user/search/abcd").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status()
				.isOk());
		
		verify(this.matrixUserService,times(1)).search("abcd");
	}
	
	@Test
	@WithMockUser
	void getUserCaseList_GIVEN_authenticatedUser_THEN_callsUserCaseRecords() throws Exception
	{
		this.mockMvc.perform(get("/api/user/case_list").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status()
				.isOk());
		
		verify(this.matrixUserService,times(1)).getUserCaseRecords();
	}
	
	@Test
	@WithMockUser
	void updatePassword_GIVEN_authenticatedUser_THEN_callsUserServiceUpdateUser() throws Exception
	{
		ChangePasswordMessage cpm = new ChangePasswordMessage("abcdefg","hijklmn","hijklmn");
		this.mockMvc.perform(patch("/api/user/password").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(this.mapper.writeValueAsString(cpm)))
													.andExpect(status().isOk());
		
		verify(this.matrixUserService,times(1)).updatePassword(cpm);
	}
	
	@Test
	@WithMockUser
	void setTheme_GIVEN_authenticatedUser_THEN_callsUserServiceSetTheme() throws Exception
	{
		String content = "{\"darkTheme\":\"true\"}";
		this.mockMvc.perform(patch("/api/user/theme").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(content))
													.andExpect(status().isOk());
		
		SetThemeMessage stm = new SetThemeMessage(true);
		verify(this.matrixUserService,times(1)).setTheme(stm);
	}
	
//	@ParameterizedTest(name = "Response should be Forbidden for {0} with no authenticated user.")
//	@ValueSource(strings = {"/api/user/all","/api/user/1", "/api/user/search/anyUserName"})
//	void allGetMethods_GIVEN_noAuthenticatedUser_THEN_Forbidden(String uri) throws Exception
//	{
//		this.mockMvc.perform(get(uri).contentType(MediaType.APPLICATION_JSON)
//				.accept(MediaType.APPLICATION_JSON)
//				.content("{}"))
//				.andExpect(status().isForbidden());
//	}
//	
//	@Test
//	@WithMockUser
//	void getAll_GIVEN_adminUser_THEN_allPasswordsEmptyStrings() throws Exception
//	{
//		this.mockMvc.perform(get("/api/user/all").accept(MediaType.APPLICATION_JSON))
//								.andExpect(jsonPath("$[0].password").value(MatrixUser.EMPTY_PASSWORD))
//								.andExpect(jsonPath("$[1].password").value(MatrixUser.EMPTY_PASSWORD))
//								.andExpect(jsonPath("$[2].password").value(MatrixUser.EMPTY_PASSWORD));
//	}
//	
//	@ParameterizedTest(name = "Status should be ok for {0} with authenticated admin user.")
//	@ValueSource(strings = {"/api/user/all","/api/user/1", "/api/user/search/anyUserName"})
//	@WithMockUser
//	void adminOnlyGetMethods_GIVEN_userIsAdmin_THEN_statusIsOk(String uri) throws Exception
//	{
//		String json = this.mapper.writeValueAsString(this.vstUser1);
//		this.mockMvc.perform(get(uri).contentType(MediaType.APPLICATION_JSON)
//													.accept(MediaType.APPLICATION_JSON)
//													.content(json))
//													.andExpect(status()
//													.isOk());
//	}
//	
//	@ParameterizedTest(name = "Status should be Forbidden for {0} with authenticated non-admin user.")
//	@ValueSource(strings = {"/api/user/all","/api/user/1", "/api/user/search/admin"})
//	@WithMockUser(roles = { "USER" })
//	void adminOnlyGetMethods_GIVEN_userIsNotAdmin_THEN_statusIsForbidden(String uri) throws Exception
//	{
//		String json = this.mapper.writeValueAsString(this.vstUser1);
//		this.mockMvc.perform(get(uri).contentType(MediaType.APPLICATION_JSON)
//													.accept(MediaType.APPLICATION_JSON)
//													.content(json))
//													.andExpect(status()
//													.isForbidden());
//	}
//	
//	@ParameterizedTest(name = "Status should be ok for {0} with authenticated admin user.")
//	@ValueSource(strings = {"/api/user/store"})
//	@WithMockUser(roles = { "ADMIN" })
//	void adminOnlyPostMethods_GIVEN_userIsAdmin_THEN_statusIsOk(String uri) throws Exception
//	{
//		String json = this.mapper.writeValueAsString(this.vstUser1);
//		this.mockMvc.perform(post(uri).contentType(MediaType.APPLICATION_JSON)
//													.accept(MediaType.APPLICATION_JSON)
//													.content(json))
//													.andExpect(status()
//													.isOk());
//	}
//
//	@ParameterizedTest(name = "Status should be Forbidden for {0} with authenticated non-admin user.")
//	@ValueSource(strings = {"/api/user/store"})
//	@WithMockUser(roles = { "USER" })
//	void adminOnlyPostMethods_GIVEN_userIsNotAdmin_THEN_statusIsForbidden(String uri) throws Exception
//	{
//		String json = this.mapper.writeValueAsString(this.vstUser1);
//		this.mockMvc.perform(post(uri).contentType(MediaType.APPLICATION_JSON)
//													.accept(MediaType.APPLICATION_JSON)
//													.content(json))
//													.andExpect(status()
//													.isForbidden());
//	}
//	
//	@WithMockUser()
//	@Test
//	void store_password_GIVEN_userIsAuthenticated_THEN_statusIsOk() throws Exception
//	{
//		ChangePasswordMessage message = new ChangePasswordMessage();
//		String json = this.mapper.writeValueAsString(message);
//		this.mockMvc.perform(post("/api/user/store_password").contentType(MediaType.APPLICATION_JSON)
//													.accept(MediaType.APPLICATION_JSON)
//													.content(json))
//													.andExpect(status()
//													.isOk());
//	}
//	
//	@ParameterizedTest(name = "Status should be redirect for {0} when no authenticated user.")
//	@ValueSource(strings = {"/api/user/store","/api/user/store_password"})
//	void allPostMethods_GIVEN_noAuthenticatedUser_THEN_statusRedirect(String uri) throws Exception
//	{
//		this.mockMvc.perform(post(uri).contentType(MediaType.APPLICATION_JSON)
//													.accept(MediaType.APPLICATION_JSON))
//													.andExpect(status()
//													.is3xxRedirection());
//	}
//
//	@ParameterizedTest(name = "Status should be redirect for {0} when no authenticated user.")
//	@ValueSource(strings = {"/api/user/all","/api/user/load/1","/api/user/current", "/api/user/search"})
//	void allGetMethods_GIVEN_noAuthenticatedUser_THEN_statusRedirect(String uri) throws Exception
//	{
//		this.mockMvc.perform(get(uri).contentType(MediaType.APPLICATION_JSON)
//													.accept(MediaType.APPLICATION_JSON))
//													.andExpect(status()
//													.is3xxRedirection());
//	}
//	
	@BeforeEach
	void init()
	{
		this.vstUser1 = new MatrixUser();
		this.vstUser1.setUsername("user1");
		this.vstUser1.setPassword("abcdefgh");
		this.vstUser1.setLastName("User1First");
		this.vstUser1.setFirstName("User1Last");
		this.vstUser1.setIsAdmin(false);
		this.vstUser1.setCreateTime(new Date());
		this.vstUser1.setLastUpdateTime(new Date());
		this.vstUser1.setExistingUser(true);

		this.vstUser2 = new MatrixUser();
		this.vstUser2.setUsername("user2");
		this.vstUser2.setPassword("abcdefgh");
		this.vstUser2.setLastName("User2First");
		this.vstUser2.setFirstName("User2Last");
		this.vstUser2.setIsAdmin(false);
		this.vstUser2.setCreateTime(new Date());
		this.vstUser2.setLastUpdateTime(new Date());
		this.vstUser2.setExistingUser(true);

		this.vstUser3 = new MatrixUser();
		this.vstUser3.setUsername("user3");
		this.vstUser3.setPassword("abcdefgh");
		this.vstUser3.setLastName("User3First");
		this.vstUser3.setFirstName("User3Last");
		this.vstUser3.setIsAdmin(false);
		this.vstUser3.setCreateTime(new Date());
		this.vstUser3.setLastUpdateTime(new Date());
		this.vstUser3.setExistingUser(true);
		
		this.userList = new LinkedList<MatrixUser>();
		this.userList.add(vstUser1);
		this.userList.add(vstUser2);
		this.userList.add(vstUser3);
		
		Mockito.when(this.matrixUserService.findAll()).thenReturn(this.userList);
	}
}
