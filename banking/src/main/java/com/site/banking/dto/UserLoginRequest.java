package com.site.banking.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for user login")
public class UserLoginRequest {
    
    @Schema(description = "Username for login", example = "john_doe", required = true)
    private String userName;
    
    @Schema(description = "User password", example = "password123", required = true)
    private String password;

    public UserLoginRequest() {}

    public UserLoginRequest(String userName, String password) {
        this.userName = userName;
        this.password = password;
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
}
