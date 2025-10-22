package com.site.banking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.site.banking.dto.ApiResponseDto;
import com.site.banking.dto.UserRegistrationRequest;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.UserRepository;

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
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

        // Validate input
        if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Username is required", "Validation Error", "userName"));
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Password is required", "Validation Error", "password"));
        }
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "First name is required", "Validation Error", "firstName"));
        }
        if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Last name is required", "Validation Error", "lastName"));
        }
        if (!user.getEmail().matches(emailRegex)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Email must be in proper format", "Validation Error", "email"));
        }
        if (user.getPhoneNumber() < 1000000000L || user.getPhoneNumber() > 9999999999L) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Phone number must have 10 digits", "Validation Error", "phoneNumber"));
        }

        if (userExists(user.getUserName())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponseDto(false, "Username '" + user.getUserName() + "' already exists. Please choose a different username.", "Registration Failed", "userName"));
        }

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // ⚠️ Creating Admin Role for first acc which has username as 'admin'
            if (user.getUserName().equals("admin")) {
                user.setRole("admin");
            }

            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponseDto(true, "User '" + user.getUserName() + "' has been created successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDto(false, "An error occurred while creating the user. Please try again.", "Registration Failed"));
        }
    }

    public ResponseEntity<ApiResponseDto> verifyUser(User user) {
        /*
        if ("admin".equalsIgnoreCase(user.getUserName()) && "admin123".equals(user.getPassword())) {
            String token = jwtService.generateTokenWithRole("admin", "ADMIN");
            ApiResponseDto response = new ApiResponseDto(true, "Welcome, Admin!");
            response.setToken(token);
            response.setRole("ADMIN");
            System.out.println("✅ Admin logged in with role ADMIN, token: " + token);
            return ResponseEntity.ok(response);
        }
         */

        // Validate input for both ADMIN or USER
        if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Username is required", "Validation Error", "userName"));
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDto(false, "Password is required", "Validation Error", "password"));
        }

        // Check if user exists
        if (!userExists(user.getUserName())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDto(false, "Username '" + user.getUserName() + "' does not exist. Please check your username or register first.", "Login Failed", "userName"));
        }

        try {
            // Checking username and password matches in db
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword());
            Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

            if (authentication.isAuthenticated()) {
                User dbUser = userRepository.findByUserName(user.getUserName());

                // ADMIN Validation
                if (dbUser.getRole().equalsIgnoreCase("admin")) {
                    String token = jwtService.generateTokenWithRole(dbUser.getUserName(), "ADMIN");
                    ApiResponseDto response = new ApiResponseDto(true, "Welcome, Admin!");
                    response.setToken(token);
                    response.setRole("ADMIN");
                    System.out.println("✅ Admin logged in with role ADMIN, token: " + token);
                    return ResponseEntity.ok(response);
                }

                String role = dbUser.getRole() != null ? dbUser.getRole().toUpperCase() : "USER";
                // Conversion from ROLE_USER to USER for claims
                if (role.startsWith("ROLE_")) {
                    role = role.substring(5);
                }
                String token = jwtService.generateTokenWithRole(dbUser.getUserName(), role);
                ApiResponseDto response = new ApiResponseDto(true, "Welcome back, " + dbUser.getUserName() + "!");
                response.setToken(token);
                response.setRole(role);
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

    public ResponseEntity<String> updateUser(UserRegistrationRequest userPatchDto) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUserName(userName);
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User doesn't exist");
        }
        if (userPatchDto.getUserName() != null) {
            user.setUserName(userPatchDto.getUserName());
        }
        if (userPatchDto.getPassword() != null) {
            user.setPassword(userPatchDto.getPassword());
        }
        if (userPatchDto.getFirstName() != null) {
            user.setFirstName(userPatchDto.getFirstName());
        }
        if (userPatchDto.getLastName() != null) {
            user.setLastName(userPatchDto.getLastName());
        }
        userRepository.save(user);
        return ResponseEntity.ok("Updated User");
    }

    public boolean userExists(String userName) {
        return userRepository.existsByUserName(userName);
    }
}
