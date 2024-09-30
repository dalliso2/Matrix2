package com.dca.matrix.security;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserRepository;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity
public class SecurityConfig
{
	@Bean
	public PasswordEncoder passwordEncoder()
	{
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain web(HttpSecurity http) throws Exception
	{
		// allow frames for h2 console
		http.headers(h -> h.frameOptions(f -> f.sameOrigin()));

		http.authorizeHttpRequests(auth->auth.requestMatchers(antMatcher("/h2-console/**"))
		.permitAll());

		// make sure all users are authenticated
		http.authorizeHttpRequests(auth->auth.requestMatchers(antMatcher("/**"))
				.authenticated()).csrf(csrf->csrf.disable());
		
		return http.formLogin(f->f.defaultSuccessUrl("/index.html"))
				// remove httpBasic for production
				.httpBasic(withDefaults())
				.build();
	}	
	
	@Bean
	public UserDetailsService userDetailsService(MatrixUserRepository userRepo)
	{
		return username -> {
			Optional<MatrixUser> userOpt = userRepo.findByUsername(username);

			if (userOpt.isEmpty())
				throw new UsernameNotFoundException("User '" + username + "' not found");

			MatrixUser user = userOpt.get();
			return user;
		};
	}
}
