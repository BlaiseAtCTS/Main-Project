@api_account
Feature: Open a bank account for an user in Banking App

  @api_account_create
  Scenario:
    When User sends POST request to Account "Create" page
    Then User receives Status 200

  @api_account_deposit
  Scenario:
    When User sends POST request to Account "Deposit" page
    Then User receives Status 200