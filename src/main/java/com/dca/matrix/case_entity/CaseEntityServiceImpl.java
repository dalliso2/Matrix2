package com.dca.matrix.case_entity;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CaseEntityServiceImpl implements CaseEntityService
{
	private final CaseEntityRepository caseEntityRepository;
	
	@Override
	public CaseEntity addCaseEntity(CaseEntity caseEntity)
	{
		return this.caseEntityRepository.save(caseEntity);
	}

	@Override
	public void removeCaseEntity(CaseEntity caseEntity)
	{
		this.caseEntityRepository.delete(caseEntity);
	}

}
