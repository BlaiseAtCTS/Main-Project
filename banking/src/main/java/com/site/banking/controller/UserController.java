package com.site.banking.controller;

import com.site.banking.dto.UserLoginDto;
import com.site.banking.dto.UserDto;
import com.site.banking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register") // { "userName": , "password": , "firstName": , "lastName": }
    public ResponseEntity<String> registerUser(@RequestBody UserDto userDto) {
        return userService.createUser(userDto);
    }

    @PostMapping("/login") // { "userName": , "password": }
    public ResponseEntity<String> loginUser(@RequestBody UserLoginDto userLoginDto) {
        return userService.verifyUser(userLoginDto);
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserDto userDto) {
        return userService.updateUser(userDto);
    }

    // admin login
}
