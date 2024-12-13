package com.dca.matrix.timeline;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.util.Strings;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityRepository;
import com.dca.matrix.user.MatrixUser;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TimelineServiceImpl implements TimelineService
{
	private TimelineRepository timelineRepository;
	private MatrixEntityRepository matrixEntityRepository;
	private MatrixCaseRepository matrixCaseRespository;
	private final AuthenticationService authenticationService;
	
	@Override
	public TimelineDTO store(TimelineDTO timelineDTO)
	{
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		if (timelineDTO.matrixCaseId() != null)
		{
			MatrixCase mCase = this.matrixCaseRespository.findById(timelineDTO.matrixCaseId())
									.orElseThrow(()->new MatrixUncheckedException("Case with id " + timelineDTO.matrixCaseId() + " does not exist.",
										null, ApiErrorCode.TIMELINE_DOES_NOT_EXIST));
			
			currentUser.canModify(mCase);
		}
		
		List<String> fieldErrorList = new LinkedList<String>();
		
		if (Strings.isBlank(timelineDTO.name()))
			fieldErrorList.add("Timeline name cannot be blank.");

		if (timelineDTO.matrixCaseId() == null)
			fieldErrorList.add("Timleine case id cannot be blank.");
		
		if (fieldErrorList.size() > 0)
			throw new MatrixValidationException("Please correct the following errors:", fieldErrorList, ApiErrorCode.VALIDATION_ERROR);
		
		// check to make sure name is not blank
		if (Strings.isBlank(timelineDTO.name()))
			throw new MatrixValidationException("Please correct the following errors:", 
												List.of("Timeline name cannot be blank."), 
												ApiErrorCode.FIELD_VALIDATION_ERROR);
		
		Timeline t = null;
		
		if (timelineDTO.id() != null)
			t = this.timelineRepository.findById(timelineDTO.id()).orElseThrow(()->
								new MatrixUncheckedException("Timeline with id " + timelineDTO.id() + " does not exist.",
										null, ApiErrorCode.TIMELINE_DOES_NOT_EXIST));
		else
		{
			t = new Timeline();
			t.setId(timelineDTO.id());
		}		

		MatrixCase mCase = this.matrixCaseRespository.findById(timelineDTO.matrixCaseId()).orElseThrow(()->
								new MatrixUncheckedException("Case with id " + timelineDTO.matrixCaseId() + " does not exist.",
										null, ApiErrorCode.TIMELINE_DOES_NOT_EXIST));
		
		t.setMatrixCase(mCase);
		t.setName(timelineDTO.name());
		t.setDescription(timelineDTO.description());
		if (timelineDTO.matrixEntityIds() != null)
			t.setTimelineEntities(timelineDTO.matrixEntityIds().stream().map(id->new MatrixEntity(id))
											.collect(Collectors.toList()));
		
		return new TimelineDTO(this.timelineRepository.save(t));
	}

	@Override
	public TimelineDTO findById(Long id)
	{
		Timeline t = this.timelineRepository.findById(id).orElseThrow(()->
				new MatrixUncheckedException("Timeline with id " + id + " does not exist.",
						null, ApiErrorCode.TIMELINE_DOES_NOT_EXIST));
		
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		
		currentUser.canModify(t.getMatrixCase());
		
		return new TimelineDTO(t);
	}

	@Override
	public Collection<TimelineDTO> findByCase(Long caseId)
	{
		MatrixCase mcase = new MatrixCase();
		mcase.setId(caseId);
		
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		currentUser.canView(mcase);
		
		return this.timelineRepository.findByMatrixCaseOrderByName(mcase).stream().map(t->new TimelineDTO(t)).toList();
	}

}
