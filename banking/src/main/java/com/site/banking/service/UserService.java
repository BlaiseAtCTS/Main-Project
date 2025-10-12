package com.site.banking.service;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTService jwtService;

    public ResponseEntity<ApiResponseDto> createUser(User user) {
        // Validate input
        if(user.getUserName() == null || user.getUserName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Username is required", "Validation Error", "userName"));
        }
        if(user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Password is required", "Validation Error", "password"));
        }
        if(user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "First name is required", "Validation Error", "firstName"));
        }
        if(user.getLastName() == null || user.getLastName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Last name is required", "Validation Error", "lastName"));
        }
        
        if(userRepository.existsByUserName(user.getUserName())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponseDto(false, "Username '" + user.getUserName() + "' already exists. Please choose a different username.", "Registration Failed", "userName"));
        }
        
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponseDto(true, "User '" + user.getUserName() + "' has been created successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDto(false, "An error occurred while creating the user. Please try again.", "Registration Failed"));
        }
    }

    public ResponseEntity<ApiResponseDto> verifyUser(User user) {
        // Validate input
        if(user.getUserName() == null || user.getUserName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Username is required", "Validation Error", "userName"));
        }
        if(user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Password is required", "Validation Error", "password"));
        }
        
        // Check if user exists
        if(!userRepository.existsByUserName(user.getUserName())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDto(false, "Username '" + user.getUserName() + "' does not exist. Please check your username or register first.", "Login Failed", "userName"));
        }
        
        try {
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword());
            Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
            
            if(authentication.isAuthenticated()) {
                String token = jwtService.generateToken(user.getUserName());
                ApiResponseDto response = new ApiResponseDto(true, "Welcome back, " + user.getUserName() + "!");
                response.setToken(token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDto(false, "Authentication failed. Please check your credentials.", "Login Failed"));
            }
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDto(false, "Incorrect password for username '" + user.getUserName() + "'. Please check your password.", "Login Failed", "password"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDto(false, "An error occurred during login. Please try again.", "Login Failed"));
        }
    }
}
