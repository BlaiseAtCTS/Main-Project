@register @smoke
Feature: User Registration

  As a new user
  I want to register with valid details
  So that I can create an account in the banking application

  Background:
    Given "User" is on the Login page
    When User clicks on the Sign Up link
  @register_valid
  Scenario: Successful user registration with valid details
    When User enters valid data in registration page
    And User clicks on the Register button
    Then User should be redirected to the Login page

  @register_invalid_1
  Scenario: Registration fails when required fields are empty
    When User leaves all fields empty
    And User clicks on the Register button
    But A status message requiring to enter values should be displayed

  @register_invalid_2
  Scenario: Registration fails when email format is invalid
    When User enters invalid "email" in registration page
    And User clicks on the Register button
    But A status message "Email must be in proper format" should be displayed

  @register_invalid_3
  Scenario: Registration fails when phone number is not 10 digits
    When User enters invalid "phoneNumber" in registration page
    And User clicks on the Register button
    But A status message "Phone number must have 10 digits" should be displayed

  @register_invalid_4
  Scenario: Registration fails when user is younger than 18 years
    When User enters invalid "dob" in registration page
    And User clicks on the Register button
    But A status message "You should be 18 or above to apply" should be displayed
