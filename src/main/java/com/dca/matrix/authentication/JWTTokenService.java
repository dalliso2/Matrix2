package com.dca.matrix.authentication;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;

import ch.qos.logback.core.util.Duration;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JWTTokenService
{
	private static final Duration TOKEN_VALID_DURATION = Duration.buildByMinutes(10);
	
	private final Algorithm hmac512;
	private final JWTVerifier verifier;
	
	public JWTTokenService(@Value("${jwt.secret}") final String secret)
	{
		this.hmac512 = Algorithm.HMAC512(secret);
		this.verifier = JWT.require(hmac512).build();
	}
	
	public String generateToken(final String username)
	{
		return JWT.create().withSubject(username)
							.withIssuer("Matrix2")
							.withIssuedAt(Instant.now())
							.withExpiresAt(Instant.now().plusMillis(TOKEN_VALID_DURATION.getMilliseconds()))
							//.withExpiresAt(Instant.now().plusMillis(5000))
							.sign(hmac512);
	}
	
	public boolean expiresWithinMinutes(String token, long minutes)
	{
		return JWT.decode(token).getExpiresAtAsInstant().isBefore(Instant.now().plusSeconds(60*minutes));
	}
	
	public String validateTokenReturnUsername(final String token)
	{
		return verifier.verify(token).getSubject();
	}
}
