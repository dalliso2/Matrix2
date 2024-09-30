package com.dca.matrix.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@AutoConfigureMockMvc
@Slf4j
public class MatrixUserST
{
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper mapper;
	
	@MockBean
	private AuthenticationService authenticationService;
	
	@Test
	@WithMockUser
	void getAll_GIVEN_fiveUsersInTestDatabase_THEN_fiveUsersReturn() throws Exception
	{
		String result = this.mockMvc.perform(get("/api/user/all").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andReturn().getResponse().getContentAsString();
	
		List<MatrixUser> users = this.mapper.readerForListOf(MatrixUser.class).readValue(result);
		users.forEach(user->assertEquals(MatrixUser.EMPTY_PASSWORD, user.getPassword()));
	}
	
	@Test
	@WithMockUser
	void getAll_GIVEN_fiveUsersInTestDatabase_THEN_emptyPasswordsReturned() throws Exception
	{
		String result = this.mockMvc.perform(get("/api/user/all").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andReturn().getResponse().getContentAsString();
	
		List<MatrixUser> users = this.mapper.readerForListOf(MatrixUser.class).readValue(result);
		assertEquals(5,users.size());
		users.forEach(user->assertEquals(MatrixUser.EMPTY_PASSWORD, user.getPassword()));
	}
	

	
	// getUserCaseList
	
	// loadUser
	
	// searchUser
	
	// setTheme
	
	// storeUser
	
	// updatePassword
	
}