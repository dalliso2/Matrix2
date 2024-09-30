package com.dca.matrix.entity_definition;

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

import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.user.AuthenticationService;
import com.dca.matrix.user.MatrixUser;

class EntityDefinitionServiceUT
{
	private EntityDefinitionRepository edRepository = mock(EntityDefinitionRepository.class);
	private EntityDefinitionService edService = new EntityDefinitionServiceImpl(edRepository);
	
	@BeforeEach
	void setUp() throws Exception
	{

	}

	///////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// getAll //////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	
	@Test
	void getAll_GIVEN__THEN_callsRepositoryFindAllOrderByNameAsc()
	{
		this.edService.getAll();
		verify(this.edRepository,times(1)).findAllByOrderByNameAsc();
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////// createUpdateEntityDefinition //////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	@Test
	void createUpdateEntityDefinition_GIVEN_emptyFields_THEN_matrixException001()
	{
		EntityDefinition ed = new EntityDefinition();

		MatrixUncheckedException thrown = assertThrows(MatrixUncheckedException.class, ()->this.edService.createUpdateEntityDefinition(ed));
		
//		assertEquals("create_udpate_agency_001",thrown.getAPIError().errorCode());
//		assertEquals(1, thrown.getAPIError().errors().size());
//		verify(this.agencyRepository,times(0)).save(agency);
	}

//	@Test
//	void createUpdateEntityDefinition_GIVEN_validAgency_THEN_agencySaved()
//	{
//		Agency agency = new Agency();
//		agency.setAcronym("ABC");
//		agency.setName("ABC");
//		
//		Agency returnAgency = new Agency();
//		returnAgency.setId(10L);
//		
//		when(this.agencyRepository.save(agency)).thenReturn(returnAgency);
//		
//		Agency returnedAgency = assertDoesNotThrow(()->this.agencyService.createUpdateAgency(agency));
//		
//		verify(this.agencyRepository,times(1)).save(agency);
//		// verify that the Agency returned from the repository is the one returned from the service method
//		assertEquals(10L, returnedAgency.getId());
//	}
}
