//package com.dca.matrix.security;
//
//import java.io.IOException;
//import java.io.PrintWriter;
//
//import org.springframework.security.web.session.InvalidSessionStrategy;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.extern.slf4j.Slf4j;
//
//@Slf4j
//public class MatrixInvalidSessionStrategy implements InvalidSessionStrategy {
//
//    @Override
//    public void onInvalidSessionDetected(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException 
//    {
//    	PrintWriter writer = response.getWriter();
//    	writer.write("THis is the response");
//    	writer.close();
//        // Custom logic for handling invalid sessions
//        response.sendRedirect("/login?invalidSession=true"); 
//    }
//}