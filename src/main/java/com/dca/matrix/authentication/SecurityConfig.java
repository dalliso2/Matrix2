package com.dca.matrix.authentication;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.dca.matrix.user.MatrixUserRepository;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig
{
    @Bean
    PasswordEncoder passwordEncoder()
	{
		return new BCryptPasswordEncoder();
	}

    @Bean
    UserDetailsService userDetailsService(MatrixUserRepository userRepo)
	{
		return username -> {
			return userRepo.findByUsername(username)
					.orElseThrow(()->new UsernameNotFoundException("User '" + username + "' not found"));
		};
	}

    @Bean
    AuthenticationManager authenticationManager(final AuthenticationConfiguration authenticationConfiguration)
            throws Exception
    {
    	return authenticationConfiguration.getAuthenticationManager();
    }


    @Bean
    SecurityFilterChain configure(final HttpSecurity http,
                               final JWTAuthenticationRequestFilter filter,
                               UserDetailsService userDetailsService,
                               JWTTokenService tokenService) throws Exception
    {
    	http.cors(Customizer.withDefaults()).csrf(csrf->csrf.disable())
    									.authorizeHttpRequests(auth->auth.requestMatchers("/*","/api/login","/api/file/**").permitAll()
    									.anyRequest().authenticated())
    									.authenticationProvider(new JWTAuthenticationProvider(userDetailsService, tokenService))
    									.exceptionHandling(exh -> exh.authenticationEntryPoint(
    								            (request, response, ex) -> {
    								                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
    								            }
    								        ))
    									.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    									.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
    	return http.build();
    }
    
}
