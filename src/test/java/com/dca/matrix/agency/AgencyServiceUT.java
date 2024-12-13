package com.dca.matrix.agency;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.LinkedList;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.user.MatrixUser;

class AgencyServiceUT
{
	private AgencyService 		agencyService;
	private AgencyRepository 	agencyRepository;
	private AuthenticationService authenticationService;

	private MatrixUser currentUser;
	
	@BeforeEach
	void setUp() throws Exception
	{
		this.agencyRepository = mock(AgencyRepository.class);
		this.agencyService = new AgencyServiceImpl(this.agencyRepository);
		this.authenticationService = mock(AuthenticationService.class);
		this.currentUser = new MatrixUser();
		this.currentUser.setIsAdmin(true);
		
		when(this.authenticationService.getCurrentUser()).thenReturn(this.currentUser);
	}

	///////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// createUpdateAgency //////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	
	@Test
	void createUpdateAgency_GIVEN_nullFields_THEN_matrixException001()
	{

		Agency agency = new Agency();
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class, ()->this.agencyService.createUpdateAgency(agency));
		
		assertEquals("create_udpate_agency_001",thrown.getAPIError().errorCode());
		assertEquals(2, thrown.getAPIError().errors().size());
		verify(this.agencyRepository,times(0)).save(agency);
	}
	
	@Test
	void createUpdateAgency_GIVEN_emptyFields_THEN_matrixException001()
	{
		Agency agency = new Agency();
		agency.setAcronym("");
		agency.setName("ABC");
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class, ()->this.agencyService.createUpdateAgency(agency));
		
		assertEquals("create_udpate_agency_001",thrown.getAPIError().errorCode());
		assertEquals(1, thrown.getAPIError().errors().size());
		verify(this.agencyRepository,times(0)).save(agency);
	}

	@Test
	void createUpdateAgency_GIVEN_validAgency_THEN_agencySaved()
	{
		Agency agency = new Agency();
		agency.setAcronym("ABC");
		agency.setName("ABC");
		
		Agency returnAgency = new Agency();
		returnAgency.setId(10L);
		
		when(this.agencyRepository.save(agency)).thenReturn(returnAgency);
		
		Agency returnedAgency = assertDoesNotThrow(()->this.agencyService.createUpdateAgency(agency));
		
		verify(this.agencyRepository,times(1)).save(agency);
		// verify that the Agency returned from the repository is the one returned from the service method
		assertEquals(10L, returnedAgency.getId());
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// deleteAgency ////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	@Test
	public void deleteAgency_GIVEN_agencyWithIdDoesNotExist_THEN_matrixException020()
	{
		when(this.agencyRepository.findById(anyLong())).thenReturn(Optional.empty());

		Agency agency = new Agency();
		agency.setId(1L);
		
		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class, ()->this.agencyService.deleteAgency(1L));
		assertEquals("agency_service_020", thrown.getAPIError().errorCode());
		
		verify(this.agencyRepository,times(0)).delete(null);
	}
	
	@Test
	public void deleteAgency_GIVEN_agencyExists_THEN_callRepositoryDelete()
	{
		Agency agency = new Agency();
		agency.setId(1L);

		when(this.agencyRepository.findById(1L)).thenReturn(Optional.of(agency));
		
		assertDoesNotThrow(()->this.agencyService.deleteAgency(1L));
		
		verify(this.agencyRepository,times(1)).delete(agency);
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////// getAgency ////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	@Test
	public void getAgency_GIVEN_agencyWithIdDoesNotExist_THEN_callRepositoryFindByIdThenMatrixException030()
	{
		when(this.agencyRepository.findById(anyLong())).thenReturn(Optional.empty());

		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class, ()->this.agencyService.getAgency(1L));
		assertEquals("agency_service_030", thrown.getAPIError().errorCode());
		
		verify(this.agencyRepository,times(1)).findById(anyLong());
	}
	
	@Test
	public void getAgency_GIVEN_agencyExists_THEN_callRepositoryFindByIdNoException()
	{
		Agency agency = new Agency();
		agency.setId(1L);

		when(this.agencyRepository.findById(1L)).thenReturn(Optional.of(agency));
		
		assertDoesNotThrow(()->this.agencyService.getAgency(1L));
		
		verify(this.agencyRepository,times(1)).findById(1L);
	}
	
	@Test
	public void getAgencyList_GIVEN__THEN_callRepositoryFindAllOrderByName()
	{
		when(this.agencyRepository.findAllByOrderByName()).thenReturn(new LinkedList<Agency>());
		this.agencyService.getAgencyList();
		verify(this.agencyRepository,times(1)).findAllByOrderByName();		
	}
}
