package steps;

import core.config.Config;
import core.driver.DriverManager;
import io.cucumber.java.en.*;
import org.testng.Assert;
import pages.LoginPage;
import pages.RegisterPage;

public class UserRegisterSteps {
    private final LoginPage loginPage = new LoginPage();
    private final RegisterPage registerPage = new RegisterPage();

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
        registerPage.enterUserName(string);
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
        registerPage.enterPassword(string);
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

    @Then("A status message requiring to enter values should be displayed")
    public void aStatusMessageRequiringToEnterValuesShouldBeDisplayed() {
        Assert.assertTrue(registerPage.checkForStatus());
    }

    @Then("A status message {string} should be displayed")
    public void aStatusMessageShouldBeDisplayed(String arg0) {
        Assert.assertEquals(registerPage.checkForEmailStatus(), arg0);
    }
}
