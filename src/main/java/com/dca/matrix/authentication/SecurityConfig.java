package com.dca.matrix.authentication;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserRepository;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableMethodSecurity
@Slf4j
public class SecurityConfig
{
	@Bean
	public PasswordEncoder passwordEncoder()
	{
		return new BCryptPasswordEncoder();
	}

//	@Bean
//	SecurityFilterChain web(HttpSecurity http) throws Exception
//	{
//		// allow frames for h2 console
//		http.headers(h -> h.frameOptions(f -> f.sameOrigin()));
//
//		http.authorizeHttpRequests(auth->auth.requestMatchers(antMatcher("/h2-console/**"))
//		.permitAll());
//
//		// make sure all users are authenticated	
//		http.authorizeHttpRequests(auth->auth.requestMatchers(antMatcher("/**"))
//				.authenticated()).csrf(csrf->csrf.disable());
//		
//		return http.formLogin(f->f.loginProcessingUrl("/api/user/login").permitAll()).
//				sessionManagement(sm->sm.invalidSessionStrategy(invalidSessionStrategy()))
//				// remove httpBasic for production
//				.build();
//	}	
	
	@Bean
	public UserDetailsService userDetailsService(MatrixUserRepository userRepo)
	{
		return username -> {
			return userRepo.findByUsername(username)
					.orElseThrow(()->new UsernameNotFoundException("User '" + username + "' not found"));
		};
	}
	
//    @Bean
//    public PasswordEncoder passwordEncoder() 
//    {
//        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
//    }
//    
    @Bean
    public AuthenticationManager authenticationManager(final AuthenticationConfiguration authenticationConfiguration)
    		throws Exception
    {
    	return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain configure(final HttpSecurity http, final JWTAuthenticationRequestFilter filter) throws Exception
    {
		// allow frames for h2 console
		http.headers(h -> h.frameOptions(f -> f.sameOrigin()));
		
		http.authorizeHttpRequests(auth->auth.requestMatchers(antMatcher("/h2-console/**"))
		.permitAll());

    	http.cors(Customizer.withDefaults()).csrf(csrf->csrf.disable())
    									.authorizeHttpRequests(auth->auth.requestMatchers("/","/api/login","/api/file/**").permitAll()
    									.anyRequest().authenticated()).exceptionHandling(exh -> exh.authenticationEntryPoint(
    								            (request, response, ex) -> {
    								                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
    								            }
    								        ))
    									.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    									.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
    	return http.build();
    }
    
}
