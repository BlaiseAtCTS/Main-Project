package com.site.banking.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.beans.Encoder;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {

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

    public String extractUserNameFromToken(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return (extractUserNameFromToken(token).equals(userDetails.getUsername()) && extractAllClaims(token).getExpiration().after(new Date()));
    }
}
