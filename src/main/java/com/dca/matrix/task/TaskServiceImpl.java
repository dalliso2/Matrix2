package com.dca.matrix.task;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.logging.log4j.util.Strings;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authentication.AuthenticationService;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.matrix_case.MatrixCaseService;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.user.MatrixUser;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import static com.dca.matrix.task.TaskSpecifications.*;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService
{
	private final AuthorizationService authorizationService;
	private final AuthenticationService authenticationService;
	private final MatrixCaseService caseService;
	private final TaskRepository taskRepository;
	private final JdbcClient jdbcClient;
	
	@Override
	@Transactional
	public Task createUpdateTask(Task updatingTask)
	{
		Task existingTask = null;
		if (updatingTask.getId() != null)
			existingTask = taskRepository.findById(updatingTask.getId()).orElseThrow(()->
						new MatrixValidationException("Task with id " + updatingTask.getId() + " does not exist.",
														null, ApiErrorCode.TASK_DOES_NOT_EXIST));
		
		this.authorizationService.verifyUserCanModify(updatingTask.getMatrixCase().getId());
		
		List<String> errors = new LinkedList<>();
		
		// check required fields
		if (Strings.isBlank(updatingTask.getTitle()))
			errors.add("Title cannot be null");

		if (Strings.isBlank(updatingTask.getDescription()))
			errors.add("Description cannot be null.");
		
		if (errors.size() > 0)
			throw new MatrixValidationException("Please correct the following errors:", errors, ApiErrorCode.VALIDATION_ERROR);
		
		// set assignedTo date to now if ---
		// There is an existing task and the assignee has changed OR
		// There is no existing task and the assignee is not null
//		if (updatingTask.getAssignedTo() == null)
//			updatingTask.setAssignedDateTime(null);
//		else if ((existingTask != null && !Objects.equals(updatingTask.getAssignedTo(), existingTask.getAssignedTo()))
//				|| updatingTask.getAssignedTo() != null)
//			updatingTask.setAssignedDateTime(new Date());
		
//		if (updatingTask.getStatus() == TaskStatusEnum.COMPLETED)
//			updatingTask.setCompletedDateTime(new Date());
//		else 
//			updatingTask.setCompletedDateTime(null);
		
		if (existingTask != null)
			updatingTask.setCaseTaskId(existingTask.getCaseTaskId());
		else
			updatingTask.setCaseTaskId(this.getNextTaskIdForCase(updatingTask.getMatrixCase().getId()));
		
		return this.taskRepository.save(updatingTask);
	}

	@Override
	public Task getTask(Long id)
	{
		Task task = this.taskRepository.findById(id).orElseThrow(()->
						new MatrixValidationException("Task with id " + id + " does not exist.", null, ApiErrorCode.TASK_DOES_NOT_EXIST));

		this.authorizationService.verifyUserCanView(task.getMatrixCase().getId());
		
		return task;
	}
	
	@Override
	public List<Task> getTasksForCase(Long caseId)
	{
		this.authorizationService.verifyUserCanView(this.caseService.getCase(caseId).getId());
		return this.taskRepository.findByMatrixCaseId(caseId);
	}

	@Override
	public List<Task> getTasksAssignedToUser(Long userId)
	{
		MatrixUser currentUser = this.authenticationService.getCurrentUser();
		// should only be called by an admin or the user
		if (!currentUser.getId().equals(userId) && !currentUser.getIsAdmin())
			throw new MatrixUncheckedException("Not authorized to view this task list.",
					null, ApiErrorCode.NOT_AUTHORIZED);
			
		return this.taskRepository.findByAssignedToId(userId);
	}
	
	@Override
	public Iterable<Task> searchTasks(TaskQueryParameters queryParameters)
	{
		this.authorizationService.verifyUserCanView(queryParameters.caseId());
		
		Specification<Task> spec = caseEquals(queryParameters.caseId());
		
		if (!Strings.isBlank(queryParameters.searchString()))
			spec = spec.and(hasTitleLike(queryParameters.searchString()).or(hasDescriptionLike(queryParameters.searchString())));
		
		if (queryParameters.assignedToIds().length > 0)
			spec = spec.and(hasUsersIn(queryParameters.assignedToIds()));
		
		if (queryParameters.statusIds().length > 0)
			spec = spec.and(hasStatusIn(queryParameters.statusIds()));
		
		return this.taskRepository.findAll(spec);
	}
	
	private Long getNextTaskIdForCase(Long caseId)
	{
		this.authorizationService.verifyUserCanView(caseId);		
		
		String sql = """
                    select max(task.case_task_id) + 1 \
                     from task where task.case_id = ? \
                    """;
		
		Long id = (Long)this.jdbcClient.sql(sql).param(caseId).query().singleValue();
		
		if (id == null)
			id = 1L;
		
		return id;
	}
	
//	@Override
//	public List<String> searchTasks(TaskQueryParameters queryParameters)
//	{
//		StringBuilder sql = new StringBuilder()
//							.append("select " + Task.TABLE + "." + Task.ID + ", ")
//							.append(Task.TITLE + ", ")
//							.append(Task.DESCRIPTION + ", ")
//							.append(Task.STATUS + ", ")
//							.append(Task.DUE_DATE_TIME + ", ")
//							.append(MatrixUser.FIRST_NAME + ", ")
//							.append(MatrixUser.LAST_NAME + ", ")
//							.append(" from ")
//							.append(Task.TABLE + " left outer join ")
//							.append(MatrixUser.TABLE).append(" on ")
//							.append(Task.TABLE + "." + Task.ASSIGNED_TO + " = ")
//							.append(MatrixUser.TABLE + "." + MatrixUser.ID).append(" " );
//		
////		if (!Strings.isBlank(queryParameters.searchString() || queryParameters.statusIds().length > 0)
////			sql.append(" and ");
//		
//		if (queryParameters.statusIds().length > 0)
//			sql.append(" and ").append(Task.STATUS).append(" in (")
//			.append(Arrays.toString(queryParameters.statusIds()).replace("[", "").replace("]",") "));
//
//		if (!Strings.isBlank(queryParameters.searchString()))
//			sql.append(" and (")
//				.append(Task.TITLE)
//				.append(" like '%")
//				.append(queryParameters.searchString())
//				.append("%' or ")
//				.append(Task.DESCRIPTION)
//				.append(" like '%")
//				.append(queryParameters.searchString())
//				.append("%')");
//		
//		System.out.println(sql.toString());
//		
//		List<String> results =  this.jdbcClient.sql(sql.toString())
//				.query(new RowMapper<String>()
//				{
//					@Override
//					public String mapRow(ResultSet rs, int rowNum) throws SQLException
//					{
//						return new StringBuffer(rs.getString(1)).append(",")
//									.append(rs.getString(2)).append(",")
//									.append(rs.getString(3)).append(",")
//									.append(rs.getString(4)).append(",")
//									.append(rs.getString(5)).append(",")
//									.append(rs.getString(6)).append(",")
//									.append(rs.getString(7)).append(",").toString();
//					}
//				}).list();
//		List<String> returnVal = new LinkedList<String>();
//		returnVal.add("id, title, description, status, dueDateTime, firstName, lastName");
//		returnVal.addAll(results);
//		
//		return returnVal;
//	}
}
