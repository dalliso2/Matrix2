package com.dca.matrix.agency;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.dca.matrix.security.SecurityConfig;
import com.dca.matrix.user.AuthenticationService;
import com.dca.matrix.user.MatrixUserRepository;
import com.dca.matrix.user.MatrixUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Import(SecurityConfig.class)
@WebMvcTest(AgencyController.class)
class AgencyControllerUT
{
	@Autowired
	private MockMvc mockMvc;
	@MockBean
	private AgencyRepository agencyRepository;
	@MockBean
	private AgencyService agencyService;
	@MockBean
	private MatrixUserService matrixUserService;
	@MockBean
	private MatrixUserRepository userRepository;
	@MockBean
	private AuthenticationService authenticationService;
	
	private ObjectMapper mapper = new ObjectMapper();
	
	@BeforeEach
	void setUp() throws Exception
	{
	}

	// storeAgency - authentication required, otherwise redirect 
	@Test
	void store_GIVEN_noAuthenticatedUser_THEN_statusRedirect() throws Exception
	{
		Agency agency = new Agency();
		this.mockMvc.perform(post("/api/agency/store").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(this.mapper.writeValueAsString(agency)))
													.andExpect(status()
													.is3xxRedirection());
		
		verify(this.agencyService,times(0)).createUpdateAgency(agency);
	}
	
	// storeAgency - admin role required 
	@Test
	@WithMockUser(roles="USER")
	void store_GIVEN_noAdminUser_THEN_exception() throws Exception
	{
		Agency agency = new Agency();
		this.mockMvc.perform(post("/api/agency/store").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(this.mapper.writeValueAsString(agency)))
													.andExpect(status()
													.isForbidden());
		
		verify(this.agencyService,times(0)).createUpdateAgency(agency);
	}
	
	// storeAgency - admin role required 
	@Test
	@WithMockUser(roles="ADMIN")
	void store_GIVEN_adminUser_THEN_statusOK() throws Exception
	{
		Agency agency = new Agency();
		this.mockMvc.perform(post("/api/agency/store").contentType(MediaType.APPLICATION_JSON)
													.accept(MediaType.APPLICATION_JSON)
													.content(this.mapper.writeValueAsString(agency)))
													.andExpect(status()
													.isOk());
		
		verify(this.agencyService,times(1)).createUpdateAgency(agency);
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// delete //////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	
	// deleteAgency - authentication required, otherwise redirect 
	@Test
	void delete_GIVEN_noAuthenticatedUser_THEN_statusRedirect() throws Exception
	{
		this.mockMvc.perform(delete("/api/agency/delete/1")).andExpect(status()
													.is3xxRedirection());
		
		verify(this.agencyService,times(0)).deleteAgency(1L);
	}
	
	// deleteAgency - admin role required 
	@Test
	@WithMockUser(roles="USER")
	void delete_GIVEN_noAdminUser_THEN_exception() throws Exception
	{
		this.mockMvc.perform(delete("/api/agency/delete/1")).andExpect(status()
													.isForbidden());
		
		verify(this.agencyService,times(0)).deleteAgency(1L);
	}
	
	// storeAgency - admin role required 
	@Test
	@WithMockUser(roles="ADMIN")
	void delete_GIVEN_adminUser_THEN_statusOK() throws Exception
	{
		this.mockMvc.perform(delete("/api/agency/delete/1")).andExpect(status()
													.isOk());
		
		verify(this.agencyService,times(1)).deleteAgency(1L);
	}

	///////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// all /////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	@Test
	void all_GIVEN_noAuthenticatedUser_THEN_statusRedirect() throws Exception
	{
		this.mockMvc.perform(get("/api/agency/all")).andExpect(status().is3xxRedirection());
		
		verify(this.agencyService,times(0)).getAgencyList();
	}
	
	@Test
	@WithMockUser
	void all_GIVEN_authenticatedUser_THEN_statusOK() throws Exception
	{
		this.mockMvc.perform(get("/api/agency/all")).andExpect(status().isOk());
		
		verify(this.agencyService,times(1)).getAgencyList();
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// load one /////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	@Test
	void getAgency_GIVEN_noAuthenticatedUser_THEN_statusRedirect() throws Exception
	{
		this.mockMvc.perform(get("/api/agency/1")).andExpect(status().is3xxRedirection());
		
		verify(this.agencyService,times(0)).getAgencyList();
	}
	
	@Test
	@WithMockUser
	void getAgency_GIVEN_authenticatedUser_THEN_statusOK() throws Exception
	{
		this.mockMvc.perform(get("/api/agency/1")).andExpect(status().isOk());
		
		verify(this.agencyService,times(1)).getAgency(1L);
	}
}
