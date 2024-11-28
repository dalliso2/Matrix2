package com.dca.matrix.authentication;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JWTAuthenticationProvider implements AuthenticationProvider
{
	private final UserDetailsService userDetailsService;
	private final JWTTokenService tokenService;
	
	@Override
	@Transactional
	public Authentication authenticate(Authentication authentication) throws AuthenticationException
	{
		String username = tokenService.validateTokenReturnUsername((String)authentication.getCredentials());
		UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
		Authentication auth =  new PreAuthenticatedAuthenticationToken(userDetails, 
														authentication.getCredentials(),
														userDetails.getAuthorities());
		auth.setAuthenticated(true);
		log.debug("Authenticated user: " + userDetails.getUsername());
		userDetails.getAuthorities().forEach(ga->log.debug(ga.getAuthority()));
		return auth;
	}

	@Override
	public boolean supports(Class<?> authentication)
	{
		return authentication.equals(JWTAuthenticationToken.class);
	}

}
