package com.dca.matrix.link_charts;

import java.util.Collection;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.message.LongIdMessage;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(path="/api/link_chart/", produces="application/json")
@RequiredArgsConstructor
public class LinkChartController
{
	private final LinkChartService linkChartService;
	
	@GetMapping("/all_for_case/{matrixCaseId}")
	public ResponseEntity<ApiResponse<Collection<LinkChart>>> getAllForCase(@PathVariable("matrixCaseId") Long matrixCaseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.getAllForCase(matrixCaseId), 
															"Loaded link charts for case " + matrixCaseId, 
															request.getRequestURI()), HttpStatus.OK);
	}
	
	@PostMapping(path="/store", consumes="application/json")
	public ResponseEntity<ApiResponse<LinkChart>> store(@RequestBody LinkChart linkChart, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.store(linkChart), 
															"Stored link chart " + linkChart.getName(), 
															request.getRequestURI()), HttpStatus.OK);
	}
	
	@PostMapping(path="/remove",consumes="application/json")
	public ResponseEntity<ApiResponse<LinkChart>> remove(LongIdMessage linkChartId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.linkChartService.remove(linkChartId.id()), 
															"Removed link chart " + linkChartId, 
															request.getRequestURI()), HttpStatus.OK);
	}
}
