package com.dca.matrix.api;

import java.util.List;

import org.springframework.http.ResponseEntity;

public class ApiResponseUtil
{
	public static <T> ApiResponse<T> success(T payload, String message, String path)
	{
		return new ApiResponse<>(false, message, payload, null, ApiErrorCode.NONE, System.currentTimeMillis(), path); 
	}
	
	public static <T> ApiResponse<T> fail(String message, List<String> errors, ApiErrorCode errorCode, String path)
	{
		return new ApiResponse<>(true, message, null, errors, errorCode, System.currentTimeMillis(), path);
		//return new ApiResponse<>(true, message, null, List.of("error1", "error 2", "error 3"), errorCode, System.currentTimeMillis(), path);
	}
	
}
