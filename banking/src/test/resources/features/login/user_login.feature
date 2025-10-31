@login @smoke
Feature: User Login

  As a user
  who already has an account
  I want to log in to the banking application

  Background:
    Given "User" is on the Login page

  @login_valid
  Scenario: Successful user login with valid details
    When User enters valid data in login page
    And "User" clicks on the Sign In button
    Then User should be redirected to the user dashboard page

  @login_invalid_1
  Scenario: Login fails when required fields are empty
    When User leaves all fields empty
    But Sign In button is disabled

  @login_invalid_2
  Scenario: Login fails when incorrect password input is given
    When User enters invalid "password" in login page
    And "User" clicks on the Sign In button
    But A status message requiring to enter values should be displayed