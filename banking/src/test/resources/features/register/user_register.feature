@register @smoke
Feature: User Registration

  As a new user
  I want to register with valid details
  So that I can create an account in the banking application

  Background:
    Given User is on the Login page
    When User clicks on the Sign Up link
  @register_valid @full
  Scenario Outline: Successful user registration with valid details
    When User enters first name "<firstName>"
    And User enters last name "<lastName>"
    And User enters username "<userName>"
    And User enters email "<email>"
    And User enters phone number "<phoneNumber>"
    And User enters date of birth "<dob>"
    And User enters address "<address>"
    And User enters password "<password>"
    And User clicks on the Register button
    Then User should be redirected to the Login page

    Examples:
      | firstName | lastName | userName    | email            | phoneNumber | dob        | address    | password  |
      | John      | Doe      | johndoe01   | john@example.com | 9876543210  | 15-06-1998 | 123 Street | Pass@1234 |
#      | Adam      | Smith    | adamsmith01 | adam@example.com | 9171652478  | 07-01-2000 | 125 Street | Pass@4321 |

  @register_invalid_1
  Scenario: Registration fails when required fields are empty
    When User leaves all fields empty
    And User clicks on the Register button
    But A status message requiring to enter values should be displayed

  @register_invalid_2
  Scenario Outline: Registration fails when email format is invalid

    When User enters first name "<firstName>"
    And User enters last name "<lastName>"
    And User enters username "<userName>"
    And User enters email "<email>"
    And User enters phone number "<phoneNumber>"
    And User enters date of birth "<dob>"
    And User enters address "<address>"
    And User enters password "<password>"
    And User clicks on the Register button
    But A status message "Email must be in proper format" should be displayed

    Examples:
      | firstName | lastName | userName  | email    | phoneNumber | dob        | address    | password  |
      | John      | Doe      | johndoe01 | john@    | 9876543210  | 15-06-1998 | 123 Street | Pass@1234 |
      | John      | Doe      | johndoe01 | john.com | 9876543210  | 15-06-1998 | 123 Street | Pass@1234 |

  @register_invalid_3
  Scenario Outline: Registration fails when phone number is not 10 digits
    When User enters first name "<firstName>"
    And User enters last name "<lastName>"
    And User enters username "<userName>"
    And User enters email "<email>"
    And User enters phone number "<phoneNumber>"
    And User enters date of birth "<dob>"
    And User enters address "<address>"
    And User enters password "<password>"
    And User clicks on the Register button
    But A status message "Phone number must have 10 digits" should be displayed

    Examples:
      | firstName | lastName | userName  | email            | phoneNumber | dob        | address    | password  |
      | John      | Doe      | johndoe01 | john@example.com | 98765410    | 15-06-1998 | 123 Street | Pass@1234 |
      | John      | Doe      | johndoe01 | john@example.com | 987654310   | 15-06-1998 | 123 Street | Pass@1234 |

  @register_invalid_4
  Scenario Outline: Registration fails when user is younger than 18 years
    When User enters first name "<firstName>"
    And User enters last name "<lastName>"
    And User enters username "<userName>"
    And User enters email "<email>"
    And User enters phone number "<phoneNumber>"
    And User enters date of birth "<dob>"
    And User enters address "<address>"
    And User enters password "<password>"
    And User clicks on the Register button
    But A status message "You should be 18 or above to apply" should be displayed

    Examples:
      | firstName | lastName | userName  | email            | phoneNumber | dob        | address    | password  |
      | John      | Doe      | johndoe01 | john@example.com | 9876543210  | 27-01-2015 | 123 Street | Pass@1234 |
      | John      | Doe      | johndoe01 | john@example.com | 9876543210  | 15-06-2027 | 123 Street | Pass@1234 |