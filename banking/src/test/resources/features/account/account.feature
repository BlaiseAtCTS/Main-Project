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
  Scenario Outline: Successful creation of user account
    When User clicks on "Create Account" Action
    And User clicks on Account Type as "<AccountType>"
    And User enters Initial Balance as "<InitialBalance>"
    And User clicks on Submit Request Button
    Then A success message "Account creation request submitted successfully! Waiting for admin approval." should be displayed

    Examples:
      | AccountType | InitialBalance |
      | SAVINGS     | 10000          |
      | CHECKING    | 12000          |
      | CREDIT      | 2000           |

  @deposit @action
  Scenario Outline: Successful deposit into user account
    When User clicks on "Deposit Money" Action
    And User selects Account Number
    And User enters Amount "<DepositAmount>"
    And User clicks on Submit Button
    Then A success message "Successfully deposited $5000! New balance will be reflected shortly." should be displayed

    Examples:
      | DepositAmount |
      | 5000          |

  @withdraw @action
  Scenario Outline: Successful withdrawal from user account
    When User clicks on "Withdraw Money" Action
    And User selects Account Number
    And User enters Amount "<WithdrawAmount>"
    And User clicks on Submit Button
    Then A success message "Successfully withdrew $3,000.00 from your account!" should be displayed

    Examples:
      | WithdrawAmount |
      | 3000           |

  @transfer @action
  Scenario Outline: Successful transfer of funds from one user to another user
    When User clicks on "Transfer Money" Action
    And User selects Account Number
    And User enters "<DestinationAccountNumber>"
    And User enters Amount "<TransferAmount>"
    And User clicks on Submit Button
    Then A success message "Transfer completed successfully!" should be displayed

    Examples:
      | DestinationAccountNumber | TransferAmount |
      | 0129057588               | 300            |