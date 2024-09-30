package com.dca.matrix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@SpringBootApplication
public class Matrix2Application
{
	public static void main(String[] args)
	{
		SpringApplication.run(Matrix2Application.class, args);
	}

	public class RequestLoggingFilterConfig
	{

		@Bean
		public CommonsRequestLoggingFilter logFilter()
		{
			CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
			filter.setIncludeQueryString(true);
			filter.setIncludePayload(true);
			filter.setMaxPayloadLength(10000);
			filter.setIncludeHeaders(false);
			filter.setAfterMessagePrefix("REQUEST DATA: ");
			return filter;
		}
	}
}
