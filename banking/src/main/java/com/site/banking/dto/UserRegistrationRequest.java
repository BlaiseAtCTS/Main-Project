package com.site.banking.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for user registration")
public class UserRegistrationRequest {
    
    @Schema(description = "Username for login", example = "john_doe", required = true)
    private String userName;
    
    @Schema(description = "User password", example = "password123", required = true)
    private String password;
    
    @Schema(description = "User's first name", example = "John", required = true)
    private String firstName;
    
    @Schema(description = "User's last name", example = "Doe", required = true)
    private String lastName;

    public UserRegistrationRequest() {}

    public UserRegistrationRequest(String userName, String password, String firstName, String lastName) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}

