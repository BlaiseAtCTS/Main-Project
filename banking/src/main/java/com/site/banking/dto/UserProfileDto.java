package com.site.banking.dto;

import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User profile information including accounts")
public class UserProfileDto {
    @Schema(description = "User's first name")
    private String firstName;

    @Schema(description = "User's last name")
    private String lastName;

    @Schema(description = "User's username")
    private String userName;

    @Schema(description = "List of user's accounts")
    private List<AccountDto> accounts;

    // Constructors
    public UserProfileDto() {}

    public UserProfileDto(String firstName, String lastName, String userName, List<AccountDto> accounts) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
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

    public List<AccountDto> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountDto> accounts) {
        this.accounts = accounts;
    }
}