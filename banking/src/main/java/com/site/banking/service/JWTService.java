package com.site.banking.service;

import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JWTService {

    private static final Logger logger = LoggerFactory.getLogger(JWTService.class);

    private SecretKey secretKey = null;

    public JWTService() {
        KeyGenerator keyGen = null;
        try {
            keyGen = KeyGenerator.getInstance("HmacSHA256");
            this.secretKey = keyGen.generateKey();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims(claims)
                .issuer("Humans")
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000))
                .signWith(getKey())
                .compact();
    }
    public String generateTokenWithRole(String username, String role) {
    return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
            .signWith(getKey(), SignatureAlgorithm.HS256)
            .compact();
}


    private SecretKey getKey() {
        return secretKey;
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Date expiration = extractAllClaims(token).getExpiration();
            if (expiration != null && expiration.before(new Date())) {
                logger.warn("Token is expired");
                return false;
            }
            return true;
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}