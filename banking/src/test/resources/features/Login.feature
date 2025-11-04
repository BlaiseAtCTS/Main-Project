Feature: Login Functionality
  As a user of the banking application
  I want to be able to login
  So that I can access my account

  Background:
    Given I am on the login page

  Scenario Outline: Login with valid credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click on the login button
    Then I should be redirected to the dashboard
    And I should see the welcome message

    Examples:
      | username          | password     |
      | shubhrocks20    | secret      |
      | shubhcog     | secret    |

  Scenario Outline: Login with invalid credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click on the login button
    Then I should see an error message "<errorMessage>"
    And I should remain on the login page

    Examples:
      | username         | password  | errorMessage        |
      | invalid@test.com | Wrong@123 | Invalid credentials |
      | admin@test.com   | WrongPass | Invalid credentials |

  Scenario: Navigate to registration page from login
    When I click on the register link
    Then I should be redirected to the registration page

  Scenario: Logout functionality
    When I enter username "shubhrocks20"
    And I enter password "secret"
    And I click on the login button
    And I am on the dashboard
    When I click on the logout button
    Then I should be redirected to the login page
