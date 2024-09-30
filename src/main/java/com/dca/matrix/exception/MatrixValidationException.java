package com.dca.matrix.exception;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;

import com.dca.matrix.api.ApiErrorCode;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class MatrixValidationException extends RuntimeException
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;
	private List<String> errors;
	private ApiErrorCode errorCode;

	public MatrixValidationException(String message, List<String> errors, ApiErrorCode errorCode)
	{
		this.message = message;
		this.errors = errors;
		this.errorCode = errorCode;
	}
}
