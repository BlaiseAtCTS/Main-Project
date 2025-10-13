package com.site.banking.service;

import com.site.banking.dto.UserLoginDto;
import com.site.banking.dto.UserDto;
import com.site.banking.model.Role;
import com.site.banking.model.User;
import com.site.banking.repository.AccountRepository;
import com.site.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    private String passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$";

    public ResponseEntity<String> createUser(UserDto userDto) {
        if(userRepository.existsByUserName(userDto.getUserName())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User already exists");
        }
        User user = new User();
        user.setUserName(userDto.getUserName());
        /*
        if(!userDto.getPassword().matches(passwordRegex)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Password not strong");
        }
        */
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setRole(Role.USER.toString());

        userRepository.save(user);
        return ResponseEntity.ok("User created");
    }

    public ResponseEntity<String> verifyUser(UserLoginDto userLoginDto) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userLoginDto.getUserName(), userLoginDto.getPassword());
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        if(authentication.isAuthenticated()) {
            String token = jwtService.generateToken(userLoginDto.getUserName());
            return ResponseEntity.ok("Token: " + token);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not logged in");
    }

    public ResponseEntity<String> updateUser(UserDto userDto) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUserName(userName);
        if(user == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User doesn't exist");
        }
        if(userDto.getUserName() != null) {
            user.setUserName(userDto.getUserName());
        }
        if(userDto.getPassword() != null) {
            user.setPassword(userDto.getPassword());
        }
        if(userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }
        if(userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }
        userRepository.save(user);
        return ResponseEntity.ok("Updated User");
    }
}
