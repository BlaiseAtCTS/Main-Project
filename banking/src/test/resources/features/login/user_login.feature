@login @smoke
Feature: User Login

  As a user
  who already has an account
  I want to log in to the banking application

  Background:
    Given "User" is on the Login page

  @login_valid @regression
  Scenario: Successful user login with valid details
    When User enters valid data in login page
    And "User" clicks on the Sign In button
    Then User should be redirected to the user dashboard page

  @login_invalid_1 @regression
  Scenario: Login fails when required fields are empty
    When User leaves all fields empty
    But Sign In button is disabled

  @login_invalid_2 @regression
  Scenario: Login fails when incorrect password input is given
    When User enters invalid "password" in login page
    And "User" clicks on the Sign In button
    But A status message "Incorrect password for username 'adamsmith01'. Please check your password." should be displayed

  @login_invalid_3 @regression
  Scenario: Login fails when username is not available
    When User enters invalid "username" in login page
    And "User" clicks on the Sign In button
    But A status message "Username 'adamsmith0' does not exist. Please check your username or register first." should be displayed