package com.dca.matrix.authentication;

import java.util.Collection;
import java.util.LinkedList;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class JWTAuthenticationToken extends AbstractAuthenticationToken
{
	private UserDetails userDetails;
	private String jwtToken;
	
	public JWTAuthenticationToken(String jwtToken)
	{
		super(new LinkedList<GrantedAuthority>());
		this.jwtToken = jwtToken;
	}

	@Override
	public Object getCredentials()
	{
		return this.jwtToken;
	}

	@Override
	public Object getPrincipal()
	{
		return this.userDetails;
	}

}
