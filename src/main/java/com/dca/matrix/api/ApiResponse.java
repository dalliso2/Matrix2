package com.dca.matrix.api;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ApiResponse<T>
{
	private boolean api_error;
	private String message;
	private T payload;
	private List<String> errors;
	private ApiErrorCode errorCode;
	private long timestamp;
	private String endpoint;
}
