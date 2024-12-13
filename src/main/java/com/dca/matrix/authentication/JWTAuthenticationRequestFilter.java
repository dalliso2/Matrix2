package com.dca.matrix.authentication;

import java.io.IOException;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dca.matrix.user.MatrixUserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JWTAuthenticationRequestFilter extends OncePerRequestFilter
{	
	public static String BEARER_TOKEN_KEY = "com.dca.matrix.bearer_token_key";
	
	private final AuthenticationManager authenticationManager;
	private final JWTTokenService tokenService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException
	{
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

		if (!Strings.isBlank(authHeader) && authHeader.startsWith("Bearer "))
		{
			String token = authHeader.substring(7);
			Authentication auth = this.authenticationManager.authenticate(new JWTAuthenticationToken(token));
			SecurityContextHolder.getContext().setAuthentication(auth);
			if (this.tokenService.expiresWithinMinutes(token, 10))
			{
				request.setAttribute(BEARER_TOKEN_KEY, this.tokenService.generateToken(auth.getName()));
			}
		} 
		
		filterChain.doFilter(request, response);
	}

}
