package com.site.banking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

import java.util.Date;

@Schema(description = "Request object for user registration")
public class UserRegistrationRequest {

    @Schema(description = "Username for login", example = "john_doe", required = true)
    @Column(unique = true)
    private String userName;
    
    @Schema(description = "User password", example = "password123", required = true)
    private String password;
    
    @Schema(description = "User's first name", example = "John", required = true)
    private String firstName;
    
    @Schema(description = "User's last name", example = "Doe", required = true)
    private String lastName;

    @Email(message = "Invalid email format")
    @Schema(description = "User's email address", example = "doe@gmail.com")
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "Invalid mobile number")
    @Schema(description = "User's phone number", example = "9087654321")
    private Long phoneNumber;

    @Schema(description = "User's date of birth", example = "09-04-2003")
    private Date dob;

    @Schema(description = "User's address", example = "Tiruppur")
    private String address;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}

