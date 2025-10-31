package steps;

import core.driver.DriverManager;
import io.cucumber.java.en.*;
import org.testng.Assert;
import pages.*;

import java.sql.Driver;

public class UserRegisterSteps {
    private final LoginPage loginPage = new LoginPage();
    private final RegisterPage registerPage = new RegisterPage();
    private final UserDashboardPage userDashboardPage = new UserDashboardPage();
    private final UserAccountPage userAccountPage = new UserAccountPage();
    private final UserDepositPage userDepositPage = new UserDepositPage();
    private final UserWithdrawPage userWithdrawPage = new UserWithdrawPage();
    private final UserTransactionPage userTransactionPage = new UserTransactionPage();

    private final AdminDashboardPage adminDashboardPage = new AdminDashboardPage();

    @Given("{string} is on the Login page")
    public void isOnTheLoginPage(String arg0) {
        loginPage.open();
        Assert.assertEquals(DriverManager.getCurrUrl(), loginPage.loginPageUrl());
    }
    @When("User clicks on the Sign Up link")
    public void userClicksOnTheSignUpLink() {
        loginPage.clickSignUpLink();
        Assert.assertEquals(DriverManager.getCurrUrl(), registerPage.registerPageUrl());
    }
    @When("User clicks on the Register button")
    public void userClicksOnTheRegisterButton() {
        registerPage.clickRegisterButton();
    }
    @Then("User should be redirected to the Login page")
    public void userShouldBeRedirectedToTheLoginPage() {
        registerPage.waitForLoginPage();
        Assert.assertEquals(DriverManager.getCurrUrl(), loginPage.loginPageUrl());
    }

    @When("User leaves all fields empty")
    public void userLeavesAllFieldsEmpty() {
        // leaving fields empty
    }

    @But("A status message requiring to enter values should be displayed")
    public void aStatusMessageRequiringToEnterValuesShouldBeDisplayed() {
        Assert.assertTrue(registerPage.checkForStatus());
    }

    @But("A status message {string} should be displayed")
    public void aStatusMessageShouldBeDisplayed(String arg0) {
        Assert.assertEquals(registerPage.checkForEmailStatus(), arg0);
    }

    @And("{string} clicks on the Sign In button")
    public void clicksOnTheSignInButton(String arg0) {
        loginPage.clickSignInButton();
    }

    @Then("User should be redirected to the user dashboard page")
    public void userShouldBeRedirectedToTheUserDashboardPage() {
        loginPage.waitForUserDashboardPage();
        Assert.assertEquals(DriverManager.getCurrUrl(), userDashboardPage.userDashboardPageUrl());
    }

    @But("Sign In button is disabled")
    public void signInButtonIsDisabled() {
        Assert.assertFalse(loginPage.checkSignInButtonIsDisabled());
    }

    @When("User clicks on {string} Action")
    public void userClicksOnAction(String arg0) {
        userDashboardPage.clicksOnAction(arg0);
    }

    @And("User selects Account Type")
    public void userSelectsAccountType() {
        userAccountPage.clicksOnAccountType();
    }

    @And("User enters {string} Amount")
    public void userEntersAmount(String amountType) {
        userAccountPage.amountType(amountType);
    }

    @And("User clicks on Submit Request Button")
    public void userClicksOnSubmitRequestButton() {
        userAccountPage.clicksOnSubmitRequestButton();
    }

    @Then("Admin should be redirected to the admin dashboard page")
    public void adminShouldBeRedirectedToTheAdminDashboardPage() {
        adminDashboardPage.waitForDashboardPage();
        Assert.assertEquals(DriverManager.getCurrUrl(), adminDashboardPage.adminDashboardPageUrl());
    }

    @When("Admin Approve or Decline the request")
    public void adminApproveOrDeclineTheRequest() {
        adminDashboardPage.clickAction();
    }

    @And("Admin will accept the Alert")
    public void adminWillAcceptTheAlert() {
        adminDashboardPage.handleAlert();
    }

    @Then("Admin will receive a status message")
    public void adminWillReceiveAStatusMessage() {
        Assert.assertTrue(adminDashboardPage.checkStatus());
    }

    @And("User selects Account Number")
    public void userSelectsAccountNumber() {
        if (DriverManager.getCurrUrl().equals(userDepositPage.userDepositPageUrl())) {
            userDepositPage.selectAccountNumber();
        } else if (DriverManager.getCurrUrl().equals(userWithdrawPage.userWithdrawPageUrl())) {
            userWithdrawPage.selectAccountNumber();
        } else if (DriverManager.getCurrUrl().equals(userTransactionPage.userTransactionPageUrl())) {
            userTransactionPage.selectAccountNumber();
        }
    }

    @And("User clicks on Submit Button")
    public void userClicksOnSubmitButton() {
        if(DriverManager.getCurrUrl().equals(userDepositPage.userDepositPageUrl())) {
            userDepositPage.clickDepositNowButton();
        } else if(DriverManager.getCurrUrl().equals(userWithdrawPage.userWithdrawPageUrl())) {
            userWithdrawPage.clickDepositNowButton();
        } else if(DriverManager.getCurrUrl().equals(userTransactionPage.userTransactionPageUrl())) {
            userTransactionPage.clickTransferButton();
        }
    }

    @Then("A success message should be displayed")
    public void aSuccessMessageShouldBeDisplayed() {
        if(DriverManager.getCurrUrl().equals(userDepositPage.userDepositPageUrl())) {
            Assert.assertTrue(userDepositPage.checkStatus());
        } else if(DriverManager.getCurrUrl().equals(userWithdrawPage.userWithdrawPageUrl())) {
            Assert.assertTrue(userWithdrawPage.checkStatus());
        } else if(DriverManager.getCurrUrl().equals(userTransactionPage.userTransactionPageUrl())) {
            Assert.assertTrue(userTransactionPage.checkStatus());
        }
    }

    @And("User enters Destination Account Number")
    public void userEntersDestinationAccountNumber() {
        userTransactionPage.enterDestinationAccount();
    }

    @When("User enters valid data in registration page")
    public void userEntersValidDataInRegistrationPage() {
        registerPage.userEntersValidDataInRegistrationPage(null);
    }

    @When("User enters invalid {string} in registration page")
    public void userEntersInvalidInRegistrationPage(String typeOfInvalidInput) {
        registerPage.userEntersInvalidDataInRegistrationPage(typeOfInvalidInput);
    }

    @When("User enters valid data in login page")
    public void userEntersValidDataInLoginPage() {
        loginPage.userEntersValidDataInLoginPage(null);
    }

    @When("User enters invalid {string} in login page")
    public void userEntersInvalidInLoginPage(String typeOfInvalidInput) {
        loginPage.userEntersInvalidInLoginPage(typeOfInvalidInput);
    }

    @When("Admin enters username")
    public void adminEntersUsername() {
        loginPage.adminEntersUsername();
    }

    @And("Admin enters password")
    public void adminEntersPassword() {
        loginPage.adminEntersPassword();
    }
}
