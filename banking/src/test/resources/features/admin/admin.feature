@admin
Feature:
  As an Admin
  I want to log in to the banking application and manage users

  Background:
    Given "Admin" is on the Login page
    When Admin enters username
    And Admin enters password
    And "Admin" clicks on the Sign In button
    Then Admin should be redirected to the admin dashboard page

    @account_creation
    Scenario: Admin approves and declines user account creation request
      When Admin Approve or Decline the request
      And Admin will accept the Alert
      Then Admin will receive a status message