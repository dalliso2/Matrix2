package com.dca.matrix.agency;

import java.util.LinkedList;
import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgencyServiceImpl implements AgencyService
{
	private final AgencyRepository agencyRepository;
	
	@Override
	public Agency createUpdateAgency(Agency agency)
	{
		List<String> fieldErrors = new LinkedList<>();

		if (Strings.isBlank(agency.getName()))
			fieldErrors.add("Agency name cannot be blank.");
			
		if (Strings.isBlank(agency.getAcronym()))
			fieldErrors.add("Agency abbreviation cannot be blank.");
	
		if (fieldErrors.size() > 0)
			throw new MatrixValidationException("Please correct the following errors:", fieldErrors, ApiErrorCode.VALIDATION_ERROR);
		
		agency = this.agencyRepository.save(agency);
		
		return agency;
	}

	@Override
	public Agency deleteAgency(Long agencyId)
	{
		Agency existingAgency = this.agencyRepository.findById(agencyId).orElseThrow(()->
									new MatrixValidationException("Agency with id " + agencyId + " does not exist.",
																	null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));
		return existingAgency;
	}

	@Override
	public Agency getAgency(Long agencyId)
	{
		return this.agencyRepository.findById(agencyId).orElseThrow(()->
									new MatrixValidationException("Agency with id " + agencyId + " does not exist.",
											null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));
	}

	@Override
	public List<Agency> getAgencyList()
	{
		return this.agencyRepository.findAllByOrderByName();
	}

}
