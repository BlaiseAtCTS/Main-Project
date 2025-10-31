@account
Feature:
  As a user
  who already has an account
  I want to log in to the banking application and use account features

  Background:
    Given "User" is on the Login page
    When User enters valid data in login page
    And "User" clicks on the Sign In button
    Then User should be redirected to the user dashboard page

  @account_creation
  Scenario: Successful creation of user account
    When User clicks on "Create Account" Action
    And User selects Account Type
    And User enters "Initial" Amount
    And User clicks on Submit Request Button

  @deposit @action
  Scenario: Successful deposit into user account
    When User clicks on "Deposit Money" Action
    And User selects Account Number
    And User enters "Deposit" Amount
    And User clicks on Submit Button
    Then A success message should be displayed

  @withdraw @action
  Scenario: Successful withdrawal from user account
    When User clicks on "Withdraw Money" Action
    And User selects Account Number
    And User enters "Withdraw" Amount
    And User clicks on Submit Button
    Then A success message should be displayed

  @transfer @action
  Scenario: Successful transfer of funds from one user to another user
    When User clicks on "Transfer Money" Action
    And User selects Account Number
    And User enters Destination Account Number
    And User enters "Transfer" Amount
    And User clicks on Submit Button
    Then A success message should be displayed