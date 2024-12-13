package com.dca.matrix.entity_definition;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.security.SecurityConfig;
import com.dca.matrix.user.MatrixUserRepository;
import com.dca.matrix.user.MatrixUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Import(SecurityConfig.class)
@WebMvcTest(EntityDefinitionController.class)
class EntityDefinitionControllerUT
{
	@Autowired
	private MockMvc mockMvc;
	@MockBean
	private MatrixUserService matrixUserService;
	@MockBean
	private MatrixUserRepository userRepository;
	@MockBean
	private AuthenticationService authenticationService;
	@MockBean
	private EntityDefinitionService entityDefinitionService;
	
	private ObjectMapper mapper = new ObjectMapper();
	
	@BeforeEach
	void setUp() throws Exception
	{
	}

	// store - authentication required, otherwise redirect 
	@Test
	void store_GIVEN_noAuthenticatedUser_THEN_statusRedirect() throws Exception
	{
		this.mockMvc.perform(post("/api/agency/store").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(this.mapper.writeValueAsString("{}")))
													.andExpect(status()
													.is3xxRedirection());
		
		verify(this.entityDefinitionService,times(0)).createUpdateEntityDefinition(any());
	}
	
	// store - if not admin then status forbidden
	@Test
	@WithMockUser(roles="USER")
	void store_GIVEN_noAdminUser_THEN_exception() throws Exception
	{
		this.mockMvc.perform(post("/api/entity_definition/store").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(this.mapper.writeValueAsString(new EntityDefinition())))
													.andExpect(status()
													.isForbidden());
		
		verify(this.entityDefinitionService,times(0)).createUpdateEntityDefinition(any());
	}
	
	@Test
	@WithMockUser(roles="ADMIN")
	void store_GIVEN_adminUser_THEN_statusOK() throws Exception
	{
		this.mockMvc.perform(post("/api/entity_definition/store").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(this.mapper.writeValueAsString(new EntityDefinition())))
													.andExpect(status()
													.isOk());
		
		verify(this.entityDefinitionService,times(1)).createUpdateEntityDefinition(any());
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// load all ////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	@Test
	void all_GIVEN_noAuthenticatedUser_THEN_statusRedirect() throws Exception
	{
		this.mockMvc.perform(get("/api/entity_definition/all")).andExpect(status().is3xxRedirection());
		
		verify(this.entityDefinitionService,times(0)).getAll();
	}
	
	@Test
	@WithMockUser
	void getAgency_GIVEN_authenticatedUser_THEN_statusOK() throws Exception
	{
		this.mockMvc.perform(get("/api/entity_definition/all")).andExpect(status().isOk());
		
		verify(this.entityDefinitionService,times(1)).getAll();
	}
}
