//package com.dca.matrix.security;
//
//import java.util.LinkedList;
//import java.util.Optional;
//
//import javax.naming.AuthenticationException;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.AuthenticationEntryPoint;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
//import org.springframework.security.web.session.InvalidSessionStrategy;
//
//import com.dca.matrix.api.ApiErrorCode;
//import com.dca.matrix.api.ApiResponseUtil;
//import com.dca.matrix.user.MatrixUser;
//import com.dca.matrix.user.MatrixUserRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.extern.slf4j.Slf4j;
//
//import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;
//import static org.springframework.security.config.Customizer.withDefaults;
//
//@Configuration
//@EnableMethodSecurity
//@Slf4j
//public class SecurityConfig
//{
//	@Bean
//	public PasswordEncoder passwordEncoder()
//	{
//		return new BCryptPasswordEncoder();
//	}
//
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
//	
//	@Bean
//	public UserDetailsService userDetailsService(MatrixUserRepository userRepo)
//	{
//		return username -> {
//			Optional<MatrixUser> userOpt = userRepo.findByUsername(username);
//
//			if (userOpt.isEmpty())
//				throw new UsernameNotFoundException("User '" + username + "' not found");
//
//			MatrixUser user = userOpt.get();
//			return user;
//		};
//	}
//	
//	@Bean
//	public InvalidSessionStrategy invalidSessionStrategy()
//	{
//		return (request, response) ->
//		{
//			ObjectMapper mapper = new ObjectMapper();
//			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//			response.setContentType("application/json;charset=UTF-8");
//			response.getWriter().write(
//					mapper.writeValueAsString(ApiResponseUtil.fail("Invalid Session",
//																	new LinkedList<String>(), 
//																	ApiErrorCode.INVALID_SESSION,
//																	"")));
//		};
//	}
//	
////    @Bean
////    public AuthenticationEntryPoint authenticationEntryPoint()
////    {
////        return (request, response, authException)->
////        {
////        	response.setContentType("application/json;charset=UTF-8");
////        	response.setStatus(HttpServletResponse.SC_FORBIDDEN);
////        	response.getWriter().write();
////        };
////    }
//}
