	package com.dca.matrix.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler
{
	@ExceptionHandler({Exception.class})
	public ResponseEntity<ApiResponse<Void>> handleException(Exception ex, HttpServletRequest request)
	{
		ex.printStackTrace();
		return new ResponseEntity<>(ApiResponseUtil.fail(ex.getMessage(), null, ApiErrorCode.INTERNAL_SERVER_ERROR, request),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
//	@ExceptionHandler({MatrixUncheckedException.class})
//	public ResponseEntity<ApiResponse<Void>> handleMatrixException(MatrixUncheckedException ex, HttpServletRequest request)
//	{
//		return new ResponseEntity<>(ApiResponseUtil.fail(ex.getMessage(), ex.getErrors(), ex.getErrorCode(), request),
//									ex.getHttpStatus());
//	}

	@ExceptionHandler({MatrixValidationException.class})
	public ResponseEntity<ApiResponse<Void>> handleMatrixValidationException(MatrixValidationException ex, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.fail(ex.getMessage(), ex.getErrors(), ex.getErrorCode(), request),
									HttpStatus.OK);
	}
	
	@ExceptionHandler({MatrixUncheckedException.class})
	public ResponseEntity<ApiResponse<Void>> handleMatrixValidationException(MatrixUncheckedException ex, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.fail(ex.getMessage(), ex.getErrors(), ex.getErrorCode(), request),
									HttpStatus.OK);
	}
	
	@ExceptionHandler({AccessDeniedException.class})
	@ResponseBody
	public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(Exception ex, HttpServletRequest request)
	{
		return new ResponseEntity<>(ApiResponseUtil.fail(ex.getMessage(), null, ApiErrorCode.NOT_AUTHORIZED, request),
										HttpStatus.FORBIDDEN);
	}
}
