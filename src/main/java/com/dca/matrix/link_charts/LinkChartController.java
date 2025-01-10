package com.dca.matrix.link_charts;

import java.util.Collection;

import org.hibernate.internal.log.DeprecationLogger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.message.LongIdMessage;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path="/api/link_chart/", produces="application/json")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("isAuthenticated()")
public class LinkChartController
{
	private final LinkChartService linkChartService;
	
	@GetMapping("/all_for_case/{matrixCaseId}")
	public ResponseEntity<ApiResponse<Collection<LinkChart>>> getAllForCase(@PathVariable("matrixCaseId") Long matrixCaseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.getAllForCase(matrixCaseId), 
															"Loaded link charts for case " + matrixCaseId, 
															request), HttpStatus.OK);
	}
	
	@GetMapping("/list/{matrixCaseId}")
	public ResponseEntity<ApiResponse<Collection<LinkChartListItem>>> listAllForCase(@PathVariable("matrixCaseId") Long matrixCaseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.getLinkChartListItemsForCase(matrixCaseId), 
															"Loaded link chart list for case " + matrixCaseId, 
															request), HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<LinkChart>> findById(@PathVariable("id") Long linkChartId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.findById(linkChartId), 
															"Loaded link chart with id " + linkChartId, 
															request), HttpStatus.OK);
	}
	
	@PostMapping(path="/store")
	public ResponseEntity<ApiResponse<LinkChart>> store(@RequestBody LinkChart linkChart, HttpServletRequest request)
	{	
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.store(linkChart), 
															"Stored link chart " + linkChart.getName(), 
															request), HttpStatus.OK);
	}
	
	@PostMapping(path="/remove",consumes="application/json")
	public ResponseEntity<ApiResponse<LinkChart>> remove(LongIdMessage linkChartId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.remove(linkChartId.id()), 
															"Removed link chart " + linkChartId, 
															request), HttpStatus.OK);
	}
	
	@PostMapping(path="/update_name_description",consumes="application/json")
	public ResponseEntity<ApiResponse<LinkChartNameDescriptionMessage>> updateNameDescription(@RequestBody LinkChartNameDescriptionMessage linkChartNameDescriptionMessage, 
																			HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.updateLinkChartNameDescription(linkChartNameDescriptionMessage), 
															"Updated link chart name/description for link chart " + linkChartNameDescriptionMessage.name(), 
															request), HttpStatus.OK);
	}
}
