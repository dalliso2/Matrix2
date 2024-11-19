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
	private final AuthenticationManager authenticationManager;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException
	{
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

		if (!Strings.isBlank(authHeader) && authHeader.startsWith("Bearer "))
		{
			Authentication auth = this.authenticationManager.authenticate(new JWTAuthenticationToken(authHeader.substring(7)));
			SecurityContextHolder.getContext().setAuthentication(auth);
		}
		
		filterChain.doFilter(request, response);
	}

}
