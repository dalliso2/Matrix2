package com.dca.matrix.link_charts;

import java.util.Collection;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LinkChartServiceImpl implements LinkChartService
{
	private final LinkChartRepository linkChartRepository;
	private final MatrixCaseRepository matrixCaseRepository;
	
	@Override
	public Collection<LinkChart> getAllForCase(Long matrixCaseId)
	{
		MatrixCase matrixCase = this.matrixCaseRepository.findById(matrixCaseId).orElseThrow(
						()->new MatrixUncheckedException("Matrix case with id " + matrixCaseId + " does not exist.",
								null, ApiErrorCode.CASE_DOES_NOT_EXIST));
		
		this.linkChartRepository.findAllByMatrixCase(matrixCase);
		return null;
	}

	@Override
	public LinkChart store(LinkChart linkChart)
	{
		return this.linkChartRepository.save(linkChart);
	}

	@Override
	public LinkChart remove(Long linkChartId)
	{
		LinkChart linkChart = this.linkChartRepository.findById(linkChartId).orElseThrow(
				()->new MatrixUncheckedException("Link chart with id " + linkChartId + " does not exist.",
						null, ApiErrorCode.LINK_CHART_DOES_NOT_EXIST));
		this.linkChartRepository.delete(linkChart);
		return linkChart;
	}

}
