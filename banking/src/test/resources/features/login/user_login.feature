@login @smoke
Feature: User Login

  As a user
  who already has an account
  I want to log in to the banking application

  Background:
    Given User is on the Login page

  @login_valid @full
  Scenario Outline: Successful user login with valid details
    When User enters username "<userName>"
    And User enters password "<password>"
    And User clicks on the Sign In button
    Then User should be redirected to the user dashboard page

    Examples:
      | userName    | password  |
      | adamsmith01 | Pass@4321 |

  @login_invalid_1
  Scenario: Login fails when required fields are empty
    When User leaves all fields empty
    And User clicks on the Sign In button
    But A status message requiring to enter values should be displayed
#    And User clicks on the Sign In button
#    But Sign In button is disabled

  @login_invalid_2
  Scenario Outline: Login fails when incorrect password input is given
    When User enters username "<userName>"
    And User enters password "<password>"
    And User clicks on the Sign In button
    But A status message requiring to enter values should be displayed

    Examples:
      | userName  | password |
      | adamsmith01 | notPass  |