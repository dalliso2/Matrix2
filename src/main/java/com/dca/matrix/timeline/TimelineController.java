package com.dca.matrix.timeline;

import java.util.Collection;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.link_charts.LinkChartController;
import com.dca.matrix.link_charts.LinkChartService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path="/api/timeline", produces="application/json")
@RequiredArgsConstructor
@Slf4j
public class TimelineController
{
	private final TimelineService timelineService;
	
	@PostMapping("/store")
	public ResponseEntity<ApiResponse<TimelineDTO>> store(@RequestBody TimelineDTO timelineDTO, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.timelineService.store(timelineDTO),
										"Stored timeline: " + timelineDTO.name(),
										request),
										HttpStatus.OK);
	}
	
	@GetMapping("/{timelineId}")
	public ResponseEntity<ApiResponse<TimelineDTO>> findById(@PathVariable("timelineId") Long timelineId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.timelineService.findById(timelineId),
										"Retrieved timeline: " + timelineId,
										request),
										HttpStatus.OK);	
	}
	
	@GetMapping("/list/{caseId}")
	public ResponseEntity<ApiResponse<Collection<TimelineDTO>>> findByCase(@PathVariable("caseId") Long caseId, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.timelineService.findByCase(caseId),
										"Retrieved timelines for case " + caseId,
										request),
										HttpStatus.OK);	
	}
}
