@admin
Feature:
  As an Admin
  I want to log in to the banking application and manage users

  Background:
    Given User is on the Login page
    When User enters username "admin"
    And User enters password "admin"
    And User clicks on the Sign In button
    Then User should be redirected to the admin dashboard page

    @account_creation
    Scenario Outline: Admin approves and declines user account creation request
      When Admin clicks on "<Action>" Request
      And Admin will accept the Alert
      Then Admin will receive a status message

      Examples:
        | Action          |
        | Decline Request |
        | Approve Request |
        | Approve Request |