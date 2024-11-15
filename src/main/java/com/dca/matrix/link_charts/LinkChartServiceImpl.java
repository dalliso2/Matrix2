package com.dca.matrix.link_charts;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.logging.log4j.util.Strings;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.matrix_case.CaseUserRecord;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user_case_role.UserCaseRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LinkChartServiceImpl implements LinkChartService
{
	private final LinkChartRepository linkChartRepository;
	private final MatrixCaseRepository matrixCaseRepository;
	private final JdbcClient jdbcClient;
	
	@Override
	public Collection<LinkChart> getAllForCase(Long matrixCaseId)
	{
		MatrixCase matrixCase = this.matrixCaseRepository.findById(matrixCaseId).orElseThrow(
						()->new MatrixUncheckedException("Matrix case with id " + matrixCaseId + " does not exist.",
								null, ApiErrorCode.CASE_DOES_NOT_EXIST));
		
		return this.linkChartRepository.findAllByMatrixCase(matrixCase);
	}

	@Override
	public LinkChart store(LinkChart linkChart)
	{
		if (Strings.isBlank(linkChart.getName()))
			throw new MatrixValidationException("Please correct the following errors:", List.of("Link chart name cannot be blank."), ApiErrorCode.VALIDATION_ERROR);

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

	@Override
	public LinkChart findById(Long id)
	{
		return this.linkChartRepository.findById(id).orElseThrow(
				()->new MatrixUncheckedException("Link chart with id " + id + " does not exist.",
						null, ApiErrorCode.LINK_CHART_DOES_NOT_EXIST));
	}

	@Override
	public List<LinkChartListItem> getLinkChartListItemsForCase(Long caseId)
	{
		StringBuilder sql = new StringBuilder("select id, name, description ")
											.append(" from LINK_CHART ")
											.append(" where matrix_case_id = ").append(caseId)
											.append(" order by name ");
												
		
		
		return this.jdbcClient.sql(sql.toString()).query((resultSet, rowNum)->
					new LinkChartListItem(resultSet.getLong(1),
										resultSet.getString(2),
										resultSet.getString(3))).list();
	}

	
	@Override
	public LinkChartNameDescriptionMessage updateLinkChartNameDescription(
			LinkChartNameDescriptionMessage nameDescriptionMessage)
	{
		if (Strings.isBlank(nameDescriptionMessage.name()))
				throw new MatrixValidationException("Please correct the following errors:", List.of("Link chart name cannot be blank."), ApiErrorCode.VALIDATION_ERROR);
	
		LinkChart linkChart = null;
		if (!Objects.isNull(nameDescriptionMessage.id()))
		{
			linkChart = this.linkChartRepository.findById(nameDescriptionMessage.id()).orElseThrow(()->
							new MatrixUncheckedException("Link chart with id " + nameDescriptionMessage.id() + " does not exist.",
															null, ApiErrorCode.LINK_CHART_DOES_NOT_EXIST));
			// make sure case id is correct
			if (linkChart.getMatrixCase().getId().equals(nameDescriptionMessage.id()))
				new MatrixUncheckedException("Link chart " + nameDescriptionMessage.id() + " does not belong to case " + nameDescriptionMessage.matrixCase(),
						null, ApiErrorCode.LINK_CHART_CASE_INCORRECT);			
		}
		else
			linkChart = new LinkChart();
		
		MatrixCase matrixCase = this.matrixCaseRepository.findById(nameDescriptionMessage.matrixCase()).orElseThrow(
				()->new MatrixUncheckedException("Matrix case with id " + nameDescriptionMessage.matrixCase() + " does not exist.",
						null, ApiErrorCode.CASE_DOES_NOT_EXIST));
					
		linkChart.setName(nameDescriptionMessage.name());
		linkChart.setDescription(nameDescriptionMessage.Description());
		linkChart.setMatrixCase(matrixCase);
		
		linkChart = this.linkChartRepository.save(linkChart);
		
		return new LinkChartNameDescriptionMessage(linkChart.getId(), matrixCase.getId(), linkChart.getName(), linkChart.getDescription());
	}
}
