package com.site.banking.controller;

import com.site.banking.model.User;
import com.site.banking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if(userService.createUser(user)) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User already exists");
        }
        return ResponseEntity.ok("User created");
    }
    // View All Users
    @GetMapping("/views")
    public ResponseEntity<List<String>> views() {
        return ResponseEntity.ok(userService.views());
    }
}
