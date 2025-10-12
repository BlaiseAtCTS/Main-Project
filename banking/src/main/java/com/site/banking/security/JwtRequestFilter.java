package com.site.banking.security;

import com.site.banking.service.CustomUserDetailsService;
import com.site.banking.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private JWTService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String requestUri = request.getRequestURI();
        logger.debug("Processing request to '{}' with auth header: {}", requestUri, authHeader != null ? "'" + authHeader + "'" : "absent");

        String username = null;
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.debug("Extracted token: {}", token);
            try {
                logger.debug("Attempting to validate token");
                if (jwtService.validateToken(token)) {
                    username = jwtService.extractUsername(token);
                    logger.debug("Token validated successfully for user: {}", username);
                } else {
                    logger.warn("Token validation failed for request to: {}", requestUri);
                }
            } catch (Exception e) {
                logger.error("Token validation failed", e);
            }
        } else {
            if (!requestUri.startsWith("/user/login") && !requestUri.startsWith("/user/register") && 
                !requestUri.startsWith("/swagger-ui") && !requestUri.startsWith("/v3/api-docs")) {
                logger.warn("Protected endpoint '{}' accessed without Bearer token", requestUri);
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(request, response);
    }
}
