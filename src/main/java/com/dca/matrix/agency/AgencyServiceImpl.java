package com.dca.matrix.agency;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgencyServiceImpl implements AgencyService
{
	private final AgencyRepository agencyRepository;
	private final AuthorizationService authorizationService;
	
	@Override
	@Transactional
	public Agency createUpdateAgency(final Agency agency)
	{
		this.authorizationService.verifyUserIsSystemAdmin();
		
		List<String> fieldErrors = new LinkedList<>();
		
		if (Strings.isBlank(agency.getName()))
			fieldErrors.add("Agency name cannot be blank.");
			
		if (Strings.isBlank(agency.getAcronym()))
			fieldErrors.add("Agency abbreviation cannot be blank.");
	
		if (fieldErrors.size() > 0)
			throw new MatrixValidationException("Please correct the following errors:", fieldErrors, ApiErrorCode.VALIDATION_ERROR);

		this.agencyRepository.findByName(agency.getName()).ifPresent(sameNameAgency->{
			if (!Objects.equals(agency.getId(), sameNameAgency.getId()))
					throw new MatrixValidationException("An agency with the name " + agency.getName() + " already exists.", ApiErrorCode.VALIDATION_ERROR);
		});
		
		this.agencyRepository.findByAcronym(agency.getAcronym()).ifPresent(sameAcronymAgency->{
			if (!Objects.equals(agency.getId(), sameAcronymAgency.getId()))
					throw new MatrixValidationException("An agency with the abbreviation " + agency.getAcronym() + " already exists.", ApiErrorCode.VALIDATION_ERROR);
		});

		return this.agencyRepository.save(agency);
	}

	@Override
	@Transactional
	public Agency deleteAgency(Long agencyId)
	{
		this.authorizationService.verifyUserIsSystemAdmin();
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
		this.authorizationService.verifyUserIsSystemAdmin();
		return this.agencyRepository.findAllByOrderByName();
	}

}
