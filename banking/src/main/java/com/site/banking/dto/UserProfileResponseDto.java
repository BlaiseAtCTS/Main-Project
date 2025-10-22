package com.site.banking.dto;

import java.util.Date;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User profile information including accounts")
public class UserProfileResponseDto {
    @Schema(description = "User's first name")
    private String firstName;

    @Schema(description = "User's last name")
    private String lastName;

    @Schema(description = "User's username")
    private String userName;
    
    @Schema(description = "User's email address")
    private String email;
    
    @Schema(description = "User's phone number")
    private Long phoneNumber;
    
    @Schema(description = "User's date of birth")
    private Date dob;
    
    @Schema(description = "User's address")
    private String address;

    @Schema(description = "List of user's accounts")
    private List<AccountDto> accounts;

    // Constructors
    public UserProfileResponseDto() {}

    public UserProfileResponseDto(String firstName, String lastName, String userName, 
                                   String email, Long phoneNumber, Date dob, String address,
                                   List<AccountDto> accounts) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dob = dob;
        this.address = address;
        this.accounts = accounts;
    }

    // Getters and Setters
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public List<AccountDto> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountDto> accounts) {
        this.accounts = accounts;
    }
}