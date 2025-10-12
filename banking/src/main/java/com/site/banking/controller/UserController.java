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

    @PostMapping("/register") // { "userName": , "password": , "firstName": , "lastName": }
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        user.setRole("user");
        return userService.createUser(user);
    }


    // admin login
}
