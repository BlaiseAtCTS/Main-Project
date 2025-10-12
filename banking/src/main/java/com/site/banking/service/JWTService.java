package com.site.banking.service;

import io.jsonwebtoken.Jwts;
import org.springframework.http.ResponseEntity;
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

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                    .add(claims)
                    .issuer("Humans")
                    .subject(username)
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 5))
                .and()
                    .signWith(getKey())
                .compact();
    }

    private Key getKey() {
        KeyGenerator keyGen = null;
        try {
            keyGen = KeyGenerator.getInstance("HmacSHA256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        return keyGen.generateKey();
    }
}
