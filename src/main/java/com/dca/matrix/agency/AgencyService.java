package com.dca.matrix.agency;

import java.util.List;

public interface AgencyService
{
	Agency createUpdateAgency(Agency agency);
	Agency deleteAgency(Long agencyId);
	Agency getAgency(Long agencyId);
	List<Agency> getAgencyList();
}
