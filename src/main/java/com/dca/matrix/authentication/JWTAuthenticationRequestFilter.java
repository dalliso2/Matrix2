package com.dca.matrix.authentication;

import java.io.IOException;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

@Component
@RequiredArgsConstructor
public class JWTAuthenticationRequestFilter extends OncePerRequestFilter
{
	private final JWTTokenService tokenService;
	private final UserDetailsService userDetailsService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException
	{
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		
		if (Strings.isBlank(authHeader) || !authHeader.startsWith("Bearer "))
		{
			filterChain.doFilter(request, response);
			return;
		}
		
		final String token = authHeader.substring(7);
		final String username = tokenService.validateToken(token);
		
		if (username == null)
		{
			filterChain.doFilter(request, response);
			return;
		}
		
		final UserDetails user = userDetailsService.loadUserByUsername(username);
		final UsernamePasswordAuthenticationToken upaToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
		upaToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(upaToken);
		
		filterChain.doFilter(request, response);
	}

}
