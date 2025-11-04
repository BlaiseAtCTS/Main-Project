package com.site.banking.stepdefinitions;

import com.site.banking.hooks.Hooks;
import com.site.banking.pages.RegisterPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

// Removed redundant imports, will use org.testng.Assert exclusively
// import static org.junit.jupiter.api.Assertions.assertTrue;
// import static org.junit.jupiter.api.Assertions.fail;

import java.time.Duration;
import java.util.List;

import org.testng.Assert; // This is the preferred assertion framework

/**
 * Step Definitions for Registration Feature
 * Contains implementation of all steps defined in Register.feature
 */
public class RegisterStepDefinitions {

    private final WebDriver driver;
    private final RegisterPage registerPage;
    private final WebDriverWait wait;
    private static final String BASE_URL = System.getProperty("baseUrl", "http://localhost:4200");

    public RegisterStepDefinitions() {
        this.driver = Hooks.getDriver();
        this.registerPage = new RegisterPage(driver);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Given("I am on the registration page")
    public void iAmOnTheRegistrationPage() { // Removed String BASE_URL parameter as it's a static field
        registerPage.navigateTo(BASE_URL);

        Assert.assertTrue(registerPage.isOnRegistrationPage(), "User is not on the registration page");

    }

    @When("I enter first name {string}")
    public void iEnterFirstName(String firstName) {
        registerPage.enterFirstName(firstName);
    }

    @When("I enter last name {string}")
    public void iEnterLastName(String lastName) {
        registerPage.enterLastName(lastName);
    }

    @When("I enter email {string}")
    public void iEnterEmail(String email) {
        registerPage.enterEmail(email);
    }

    @When("I enter the username {string}")
    public void iEnterUsername(String username) {
        registerPage.enterUsername(username);
    }

    @When("I enter registration password {string}")
    public void iEnterRegistrationPassword(String password) {
        registerPage.enterPassword(password);
    }

    @When("I enter phone number {string}")
    public void iEnterPhoneNumber(String phoneNumber) {
        registerPage.enterPhoneNumber(phoneNumber);
    }

    @When("I enter date of birth {string}")
    public void iEnterDateOfBirth(String dateOfBirth) {
        registerPage.enterDateOfBirth(dateOfBirth);
    }

    @When("I enter address {string}")
    public void iEnterAddress(String address) {
        registerPage.enterAddress(address);
    }

    @When("I click on the register button")
    public void iClickOnTheRegisterButton() {
        registerPage.clickRegisterButton();
        // Give some time for the action to process
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @When("I click on the login link")
    public void iClickOnTheLoginLink() {
        registerPage.clickLoginLink();
    }

    @Then("the register button should be disabled")
    public void theRegisterButtonShouldBeDisabled() {
        // Aligned with Login SD's style: minimal try-catch
        try {
            WebElement registerButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("ui-button[id='register-button'] button")
                )
            );
            String disabledAttr = registerButton.getAttribute("disabled");
            boolean isEnabled = registerButton.isEnabled();

            Assert.assertTrue((disabledAttr != null || !isEnabled), 
                "Register button should be disabled when fields are empty. disabledAttr=" + disabledAttr + ", isEnabled=" + isEnabled);
        } catch (Exception e) {
            Assert.fail("Could not verify register button state: " + e.getMessage());
        }
    }

    @Then("the register button should be enabled")
    public void theRegisterButtonShouldBeEnabled() {
        // Aligned with Login SD's style: minimal try-catch
        try {
            WebElement registerButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("ui-button[id='register-button'] button")
                )
            );

            // Wait a bit for Angular to update the button state (Kept for stability)
            Thread.sleep(500);

            String disabledAttr = registerButton.getAttribute("disabled");
            boolean isEnabled = registerButton.isEnabled();

            Assert.assertTrue((disabledAttr == null && isEnabled), 
                "Register button should be enabled when all fields are filled (disabled=" + disabledAttr + ", enabled=" + isEnabled + ")");
        } catch (Exception e) {
            Assert.fail("Could not verify register button state: " + e.getMessage());
        }
    }

    @Then("I should see a success toast")
    public void iShouldSeeASuccessToast() {
        Assert.assertTrue(registerPage.isWelcomeMessageDisplayed(), "Welcome message is not displayed");

    }

    @Then("I should see an error toast")
    public void iShouldSeeAnErrorToast() {
        // Aligned with Login SD's style: minimal try-catch
        try {
            WebElement errorToast = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("[data-toast-type='error']")
                )
            );
            Assert.assertTrue(errorToast.isDisplayed(), "Error toast should be visible");
        } catch (Exception e) {
            Assert.fail("Error toast not found: " + e.getMessage());
        }
    }

    @Then("I should see an error toast or success toast")
    public void iShouldSeeAnErrorToastOrSuccessToast() {
        // Aligned with Login SD's style: minimal try-catch
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-toast-type='success']")),
                ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-toast-type='error']"))
            ));

            List<WebElement> toasts = driver.findElements(By.cssSelector("[data-toast-type]"));
            Assert.assertTrue(!toasts.isEmpty(), "At least one toast should be visible");
        } catch (Exception e) {
            Assert.fail("No toast found: " + e.getMessage());
        }
    }

    @Then("the error toast should contain {string} in description")
    public void theErrorToastShouldContainInDescription(String expectedText) {
        // Aligned with Login SD's style: minimal try-catch
        try {
            WebElement descriptionElement = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("[data-toast-type='error'] [id^='toast-description-']")
                )
            );
            String actualMessage = descriptionElement.getText();
            Assert.assertTrue(actualMessage.toLowerCase().contains(expectedText.toLowerCase()), 
                "Error message should contain '" + expectedText + "', but was: " + actualMessage);
        } catch (Exception e) {
            // Changed the nested try-catch to a simpler fail call if the primary check fails
            Assert.fail("Error message containing '" + expectedText + "' not found. " + e.getMessage());
        }
    }

    @Then("I should be redirected to login page")
    public void iShouldBeRedirectedToLoginPage() {
        // Aligned with Login SD's style: minimal try-catch and simple assertion
        try {
            // Wait for URL to change to login page
            wait.until(ExpectedConditions.urlContains("/login"));
            String currentUrl = driver.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("/login"), 
                "Should be on login page, but was: " + currentUrl);
        } catch (Exception e) {
            String currentUrl = driver.getCurrentUrl();
            Assert.fail("Not redirected to login page. Current URL: " + currentUrl + ". Error: " + e.getMessage());
        }
    }

    // --- Field Visibility Steps (Simplified Assertions) ---

    @Then("I should see the first name field")
    public void iShouldSeeTheFirstNameField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='firstName'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "First name field should be visible");
    }

    @Then("I should see the last name field")
    public void iShouldSeeTheLastNameField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='lastName'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "Last name field should be visible");
    }

    @Then("I should see the email field")
    public void iShouldSeeTheEmailField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='email'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "Email field should be visible");
    }

    @Then("I should see the username field")
    public void iShouldSeeTheUsernameField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='username'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "Username field should be visible");
    }

    @Then("I should see the password field")
    public void iShouldSeeThePasswordField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='password'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "Password field should be visible");
    }

    @Then("I should see the phone number field")
    public void iShouldSeeThePhoneNumberField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='phone'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "Phone number field should be visible");
    }

    @Then("I should see the date of birth field")
    public void iShouldSeeTheDateOfBirthField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='dateOfBirth'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "Date of birth field should be visible");
    }

    @Then("I should see the address field")
    public void iShouldSeeTheAddressField() {
        WebElement field = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-input[id='address'] input")
            )
        );
        Assert.assertTrue(field.isDisplayed(), "Address field should be visible");
    }

    @Then("I should see the register button")
    public void iShouldSeeTheRegisterButton() {
        WebElement button = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("ui-button[id='register-button'] button")
            )
        );
        Assert.assertTrue(button.isDisplayed(), "Register button should be visible");
    }

    @Then("I should see the login link")
    public void iShouldSeeTheLoginLink() {
        WebElement link = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("login-link"))
        );
        Assert.assertTrue(link.isDisplayed(), "Login link should be visible");
    }
}