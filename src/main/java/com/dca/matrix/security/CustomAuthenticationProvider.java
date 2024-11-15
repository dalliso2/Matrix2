//package com.dca.matrix.security;
//
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//
//public class CustomAuthenticationProvider implements AuthenticationProvider
//{
//
//	@Override
//	public Authentication authenticate(Authentication authentication) throws AuthenticationException
//	{
//		String username = authentication.getName();
//        String password = authentication.getCredentials().toString();
//
//        if (authenticationSuccessful) 
//        {
//            return new UsernamePasswordAuthenticationToken(username, password, authorities);
//        } 
//        else 
//        {
//            throw new BadCredentialsException("Invalid username or password");
//        }
//        
//		return null;
//	}
//
//	@Override
//	public boolean supports(Class<?> authentication)
//	{
//		// TODO Auto-generated method stub
//		return false;
//	}
//
//}
