package com.dca.matrix.matrix_entity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.file.MFile;
import com.dca.matrix.message.LongIdMessage;
import com.dca.matrix.message.LongIdsMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(path = "/api/entity", produces = "application/json")
@RequiredArgsConstructor
public class MatrixEntityController
{
	private final MatrixEntityService matrixEntityService;
	private final MatrixEntityRepository	matrixEntityRepository;
//	private ObjectMapper			objectMapper;

	@GetMapping("/{matrixEntityId}")
	public ResponseEntity<ApiResponse<MatrixEntity>> get(@PathVariable("matrixEntityId") Long matrixEntityId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.findById(matrixEntityId), 
				"Found entity with id " + matrixEntityId + ".", 
				request),
			HttpStatus.OK);
	}
	
	@PostMapping("/find_by_ids")
	public ResponseEntity<ApiResponse<Iterable<MatrixEntity>>> findByIds(@RequestBody LongIdsMessage matrixEntityIds, HttpServletRequest request)
	{ 
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.findByIds(matrixEntityIds), 
				"Found entities with ids " + matrixEntityIds, 
				request),
			HttpStatus.OK);
	}
//
//	@PostMapping("/search")
//	@ResponseStatus(HttpStatus.OK)
//	public List<MatrixEntity> get(@RequestBody EntitySearchMessage searchMessage)
//	{
//		return this.matrixEntityService.searchEntities(searchMessage);
//	}
//
//	@PostMapping("/search_for_relationships")
//	@ResponseStatus(HttpStatus.OK)
//	public List<MatrixEntity> searchForRelationships(@RequestBody NewEntityRelationshipSearchMessage searchMessage)
//	{
//		return this.matrixEntityService.searchEntitiesForRelationship(searchMessage);
//	}
	
	@PostMapping(path = "/store", consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public MatrixEntity save(@RequestBody MatrixEntity matrixEntity) throws JsonProcessingException
	{	
		MatrixEntity me = this.matrixEntityService.store(matrixEntity);
		return me;
	}

//	@GetMapping("/search")
//	@ResponseStatus(HttpStatus.OK)
//	public List<String> searchEntities(MatrixEntitySearchMessage searchMessage)
//	{
//		this.matrixEntityService.searchEntities(searchMessage);
//	}
	
//	@PostMapping(path = "/create_link", consumes = "application/json")
//	@ResponseStatus(HttpStatus.CREATED)
//	public EntityRelationship createRelationship(@RequestBody EntityRelationshipMessage entityRelationshipMessage)
//	{
////		log.debug("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
////		log.debug(entityRelationshipMessage.toString());
//		
//		return this.matrixEntityService.addRelationship(entityRelationshipMessage.entity1Id,
//				entityRelationshipMessage.entity2Id,
//				entityRelationshipMessage.entity1Entity2Description,
//				entityRelationshipMessage.entity2Entity1Description);
//	}
//	
//	@GetMapping("/users/{caseId}")
//	public Iterable<UserCaseRole> getUsersForCase(@PathVariable("caseId") Long caseId)
//	{
//		Iterable<UserCaseRole> ucrs = this.caseService.getUserCaseRolesByCaseId(caseId);		
//		return ucrs;
//	}
//
//	@GetMapping("/user_case_role/{caseId}/{username}")
//	public UserCaseRole getUserCaseRoleForUserAndCase(@PathVariable("caseId") Long caseId,
//			@PathVariable("username") String username)
//	{
//		UserCaseRole ucr = this.caseService.findUserCaseRoleByCaseIdAndUserName(caseId, username);
//		return ucr;
//	}
//
//	@PostMapping("/user_case_role/store")
//	public UserCaseRole storeUserCaseRole(@RequestBody UserCaseRoleMessage ucrMessage) throws Exception
//	{
//		return this.caseService.updateUserCaseRole(ucrMessage.getCaseId(), 
//											ucrMessage.getId(), 
//											ucrMessage.getRoleType(), 
//											ucrMessage.getMatrixUser());
//	}
	
	@PostMapping("/search")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<List<MatrixEntity>>>> search(@RequestBody MatrixEntitySearchMessage searchMessage, 
																			HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.searchEntities(searchMessage), 
																"Search succeeded.", 
																request),
															HttpStatus.OK);
	}
	
	@PostMapping("/search_unlinked_entities")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<List<MatrixEntity>>>> searchEntitiesNotLinked(@RequestBody MatrixEntitySearchMessage searchMessage,
																			HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.searchEntitiesNotLinked(searchMessage), 
				"Search succeeded.", 
				request),
				HttpStatus.OK);
	}
	
	@PostMapping("/link")
	@ResponseStatus(HttpStatus.OK)
	public EntityRelationship createRelationship(@RequestBody EntityRelationshipMessage entityRelationshipMessage)
	{
		return this.matrixEntityService.createRelationship(entityRelationshipMessage);
	}
	
	@PostMapping("/unlink")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<EntityRelationship>> removeRelationship(@RequestBody LongIdMessage idMessage, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.removeRelationship(idMessage), 
										"Removed link", 
										request),HttpStatus.OK);
	}
	
	@GetMapping("/children/{parentId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<EntityRelationshipProjection2>>> getRelatedEntities(@PathVariable("parentId") Long id, HttpServletRequest request)
	{
		//return this.matrixEntityService.getRelatedEntities(id);
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.getRelatedEntities(id), 
															"Retrieved related entities for entity " + id, 
															request),
														HttpStatus.OK);
	}

	@GetMapping("/all_link_chart_for_case/{caseId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Collection<MatrixEntityProjection>>> getAllLinkChartForCase(@PathVariable("caseId") Long caseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.getCaseEntityProjections(caseId),
															"Retrieved all entities for case: " + caseId,
															request),
														HttpStatus.OK);
	}
	
	@GetMapping("/all_for_case/{caseId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<MatrixEntity>>> getAllForCase(@PathVariable("caseId") Long caseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.getAllForCase(caseId),
															"Retrieved all entities for case: " + caseId,
															request),
														HttpStatus.OK);
	}
	
	@GetMapping("/case_relationships/{caseId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Collection<EntityRelationshipProjection>>> getCaseEntityRelationships(@PathVariable("caseId") Long caseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.getCaseEntityRelationships(caseId),
															"Retrieved entity relationships.",
															request),
															HttpStatus.OK);
															
	}
	
	@GetMapping("/timeline_entities/{caseId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<Collection<MatrixEntity>>> getTimelineEntitiesForCase(@PathVariable("caseId") Long caseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.getTimelineEntitiesForCase(caseId),
															"Retrieved entities for timeine.",
															request),
															HttpStatus.OK);
	}
	
	@GetMapping("/entity_title/{caseId}")
	public ResponseEntity<ApiResponse<Collection<MatrixEntityTitleDTO>>> findMatrixEntityTitlesByCase(@PathVariable("caseId") Long caseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.matrixEntityService.findMatrixEntityTitlesByCase(caseId),
				"Retrieved all entities for case: " + caseId,
				request),
				HttpStatus.OK);	
	}
}
