package com.dca.matrix.api;

import java.util.List;
import java.util.Optional;

import com.dca.matrix.authentication.JWTAuthenticationRequestFilter;

import jakarta.servlet.http.HttpServletRequest;

public class ApiResponseUtil
{	
	public static <T> ApiResponse<T> success(T payload, String message, HttpServletRequest request)
	{
		return new ApiResponse<>(false, 
									message, 
									payload, 
									null, 
									ApiErrorCode.NONE, 
									System.currentTimeMillis(), 
									request.getRequestURI(), 
									ApiResponseUtil.getNewAuthToken(request)); 
	}
	
	public static <T> ApiResponse<T> fail(String message, List<String> errors, ApiErrorCode errorCode, HttpServletRequest request)
	{
		return new ApiResponse<>(true, 
									message, 
									null, 
									errors, 
									errorCode, 
									System.currentTimeMillis(), 
									request.getRequestURI(), 
									ApiResponseUtil.getNewAuthToken(request));
		//return new ApiResponse<>(true, message, null, List.of("error1", "error 2", "error 3"), errorCode, System.currentTimeMillis(), path, authToken);
	}
	
	private static String getNewAuthToken(HttpServletRequest request)
	{
		// JWTAuthenticationRequestFilter set the BEARER_TOKEN_KEY to the new token if the current token is
		// exiring within 10 minutes
		String newAuthToken = null;
		Optional<Object> newAuthTokenOpt = Optional.ofNullable(request.getAttribute(JWTAuthenticationRequestFilter.BEARER_TOKEN_KEY));
		if (newAuthTokenOpt.isPresent())	
			newAuthToken = newAuthTokenOpt.get().toString();

		return newAuthToken;
	}
}
