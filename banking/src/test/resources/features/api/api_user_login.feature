@api_login
Feature: Login to an existing user account in Banking App

  Scenario:
    When User sends POST request to "login" page
    Then User receives Status 200