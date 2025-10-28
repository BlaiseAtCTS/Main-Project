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

    @Given("User is on the Login page")
    public void userIsOnTheLoginPage() {
        loginPage.open();
        Assert.assertEquals(DriverManager.getCurrUrl(), loginPage.loginPageUrl());
    }
    @When("User clicks on the Sign Up link")
    public void userClicksOnTheSignUpLink() {
        loginPage.clickSignUpLink();
        Assert.assertEquals(DriverManager.getCurrUrl(), registerPage.registerPageUrl());
    }
    @When("User enters first name {string}")
    public void userEntersFirstName(String string) {
        registerPage.enterFirstName(string);
    }
    @When("User enters last name {string}")
    public void userEntersLastName(String string) {
        registerPage.enterLastName(string);
    }
    @When("User enters username {string}")
    public void userEntersUsername(String string) {
        if(DriverManager.getCurrUrl().equals(registerPage.registerPageUrl())) {
            registerPage.enterUserName(string);
        } else if(DriverManager.getCurrUrl().equals(loginPage.loginPageUrl())) {
            loginPage.enterUserName(string);
        }
    }
    @When("User enters email {string}")
    public void userEntersEmail(String string) {
        registerPage.enterEmail(string);
    }
    @When("User enters phone number {string}")
    public void userEntersPhoneNumber(String string) {
        registerPage.enterPhoneNumber(string);
    }
    @When("User enters date of birth {string}")
    public void userEntersDateOfBirth(String string) {
        registerPage.enterDob(string);
    }
    @When("User enters address {string}")
    public void userEntersAddress(String string) {
        registerPage.enterAddress(string);
    }
    @When("User enters password {string}")
    public void userEntersPassword(String string) {
        if(DriverManager.getCurrUrl().equals(registerPage.registerPageUrl())) {
            registerPage.enterPassword(string);
        } else if(DriverManager.getCurrUrl().equals(loginPage.loginPageUrl())) {
            loginPage.enterPassword(string);
        }
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

    @And("User clicks on the Sign In button")
    public void userClicksOnTheSignInButton() {
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

    @And("User clicks on Account Type as {string}")
    public void userClicksOnAccountTypeAs(String arg0) {
        userAccountPage.clicksOnAccountType(arg0);
    }

    @And("User enters Initial Balance as {string}")
    public void userEntersInitialBalanceAs(String arg0) {
        userAccountPage.enterInitialBalance(arg0);
    }

    @And("User clicks on Submit Request Button")
    public void userClicksOnSubmitRequestButton() {
        userAccountPage.clicksOnSubmitRequestButton();
    }

    @Then("User should be redirected to the admin dashboard page")
    public void userShouldBeRedirectedToTheAdminDashboardPage() {
        adminDashboardPage.waitForDashboardPage();
        Assert.assertEquals(DriverManager.getCurrUrl(), adminDashboardPage.adminDashboardPageUrl());
    }

    @When("Admin clicks on {string} Request")
    public void adminClicksOnRequest(String arg0) {
        adminDashboardPage.clickAction(arg0);
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

    @And("User enters Amount {string}")
    public void userEntersAmount(String arg0) {
        if(DriverManager.getCurrUrl().equals(userDepositPage.userDepositPageUrl())) {
            userDepositPage.enterDepositAmount(arg0);
        } else if(DriverManager.getCurrUrl().equals(userWithdrawPage.userWithdrawPageUrl())) {
            userWithdrawPage.enterDepositAmount(arg0);
        } else if(DriverManager.getCurrUrl().equals(userTransactionPage.userTransactionPageUrl())) {
            userTransactionPage.enterDepositAmount(arg0);
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

    @And("User enters {string}")
    public void userEnters(String arg0) {
        userTransactionPage.enterDestinationAccount(arg0);
    }
}
