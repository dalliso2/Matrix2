package com.dca.matrix.authentication;

import java.util.LinkedList;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserDTO;
import com.dca.matrix.user.MatrixUserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path = "/api", produces = "application/json")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController
{
	private final JWTTokenService tokenService;
	private final MatrixUserService matrixUserService;
	private final PasswordEncoder passwordEncoder;
	
	@PostMapping("/login")
	public ResponseEntity<ApiResponse> login(@RequestBody @Valid final AuthenticationRequestDTO authRequest,
																			HttpServletRequest request)
	{
		ResponseEntity<ApiResponse> responseEntity = null;
				
		final Optional<MatrixUser> userOpt = this.matrixUserService.findByUsername(authRequest.username());
		
		if (userOpt.isPresent() && this.passwordEncoder.matches(authRequest.password(), userOpt.get().getPassword()))
		{
			
			final MatrixUserDTO user = new MatrixUserDTO(userOpt.get());
			AuthenticationResponseDTO authResponse = new AuthenticationResponseDTO(tokenService.generateToken(user.username()),
																						user);
			responseEntity = new ResponseEntity<>(ApiResponseUtil.success(authResponse, 
												"Authenticated user " + authRequest.username(), 
												request.getRequestURI()),
												HttpStatus.OK);
		}
		else
		{
			responseEntity = new ResponseEntity<>(ApiResponseUtil.fail("Invalid credentials", 
					new LinkedList<>(), 
					ApiErrorCode.INVALID_CREDENTIALS, 
					request.getRequestURI()), HttpStatus.UNAUTHORIZED);
		}
		
		return responseEntity;
	}
	
	@PostMapping("/refresh-credentials")
	public ResponseEntity<ApiResponse<AuthenticationResponseDTO>> refreshCredentials(@RequestBody @Valid final TokenRefreshDTO tokenRefreshDTO,
																			HttpServletRequest request)
	{
		MatrixUserDTO userDTO = new MatrixUserDTO((MatrixUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		AuthenticationResponseDTO authResponse = new AuthenticationResponseDTO(tokenRefreshDTO.token(), userDTO);
								
		
		return new ResponseEntity<>(ApiResponseUtil.success(authResponse, 
															"Authenticated user " + userDTO.username(), 
															request.getRequestURI()),
															HttpStatus.OK);
	}
}
