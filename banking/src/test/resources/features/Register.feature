Feature: User Registration
  As a new user
  I want to register for an account
  So that I can access the banking system

  Background:
    Given I am on the registration page
@Smoke
  Scenario Outline: Register with valid details
    When I enter first name "<firstName>"
    And I enter last name "<lastName>"
    And I enter email "<email>"
    And I enter the username "<username>"
    And I enter registration password "<password>"
    And I enter phone number "<phoneNumber>"
    And I enter date of birth "<dateOfBirth>"
    And I enter address "<address>"
    And I click on the register button
    Then I should see a success toast
    And I should be redirected to login page

    Examples:
      | firstName | lastName | email                    | username      | password    | phoneNumber  | dateOfBirth | address                        |
      | John      | Doe      | john.doe@example.com     | johndoe123    | Password@1  | 9876543210  | 1990-01-15  | 123 Main St, New York, USA    |
      | Jane      | Smith    | jane.smith@example.com   | janesmith456  | Secure#123  | 9123456789  | 1992-05-20  | 456 Oak Ave, Los Angeles, USA |
      | Robert    | Johnson  | robert.j@example.com     | robertj789    | Strong$99   | 9988776655  | 1988-11-30  | 789 Pine Rd, Chicago, USA     |
      | Emily     | Brown    | emily.brown@example.com  | emilybrown    | Test@2024   | 9001122334  | 1995-07-10  | 321 Elm St, Houston, USA      |

  Scenario: Register button should be disabled with empty fields
    Then the register button should be disabled

  Scenario: Register button should be disabled with partial data
    When I enter first name "Test"
    And I enter last name "User"
    And I enter email "test@example.com"
    And I enter username "testuser"
    And I enter registration password "Test@123"
    Then the register button should be disabled

  Scenario: Register button should be enabled with all fields filled
    When I enter first name "Test"
    And I enter last name "User"
    And I enter email "test@example.com"
    And I enter username "testuser123"
    And I enter registration password "Test@123"
    And I enter phone number "9876543210"
    And I enter date of birth "1995-06-15"
    And I enter address "123 Test Street, Test City"
    Then the register button should be enabled

  Scenario: Register with already existing username
    When I enter first name "Existing"
    And I enter last name "User"
    And I enter email "existing@example.com"
    And I enter username "shubhrocks20"
    And I enter registration password "Test@123"
    And I enter phone number "9876543210"
    And I enter date of birth "1990-01-01"
    And I enter address "123 Existing St"
    And I click on the register button
    Then I should see an error toast
    And the error toast should contain "already exists" in description

  Scenario: Navigate to login page from registration
    When I click on the login link
    Then I should be redirected to login page

  Scenario: Verify all registration form fields are present
    Then I should see the first name field
    And I should see the last name field
    And I should see the email field
    And I should see the username field
    And I should see the password field
    And I should see the phone number field
    And I should see the date of birth field
    And I should see the address field
    And I should see the register button
    And I should see the login link
