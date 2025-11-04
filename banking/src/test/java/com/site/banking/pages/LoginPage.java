package com.site.banking.pages;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * Page Object Model for Login Page
 * Contains all elements and actions related to the login functionality
 */
public class LoginPage extends BasePage {

    // WebElements - Using @FindBy annotations for Page Factory
    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//button[@id='sign-in-button']")
    private WebElement loginButton;

    @FindBy(id = "register-link")
    private WebElement registerLink;

    @FindBy(id = "toast-description")
    private WebElement errorMessage;

    @FindBy(css = ".alert-error")
    private WebElement alertError;

    @FindBy(id = "toast-description")
    private WebElement welcomeMessage;

    @FindBy(id = "logout-button")
    private WebElement logoutButton;

    private WebDriverWait wait;

    // Constructor
    public LoginPage(WebDriver driver) {
        super(driver);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Page Actions
    public void navigateToLoginPage(String baseUrl) {
        driver.get(baseUrl + "/login");
        
        // Wait for Angular to load
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Wait for page to be fully loaded
        wait.until(ExpectedConditions.visibilityOf(usernameInput));
    }

    public void enterUsername(String username) {
        // Wait for element to be visible and interactable
//        wait.until(ExpectedConditions.visibilityOf(usernameInput));
        wait.until(ExpectedConditions.elementToBeClickable(usernameInput));
        
        // Scroll element into view if needed
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", usernameInput);
        
        // Small wait after scroll
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Clear and enter username
        usernameInput.clear();
        usernameInput.sendKeys(username);
    }

    public void enterPassword(String password) {
        // Wait for element to be visible and interactable
        wait.until(ExpectedConditions.visibilityOf(passwordInput));
        wait.until(ExpectedConditions.elementToBeClickable(passwordInput));
        
        // Scroll element into view if needed
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", passwordInput);
        
        // Small wait after scroll
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Clear and enter password
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }

    public void clickLoginButton() {
        // Wait for button to be clickable
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        
        // Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", loginButton);
        
        // Small wait
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Click using JavaScript if normal click fails
        try {
            loginButton.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", loginButton);
        }
    }

    public void clickRegisterLink() {
        wait.until(ExpectedConditions.elementToBeClickable(registerLink));
        registerLink.click();
    }

    public void clickLogoutButton() {
        wait.until(ExpectedConditions.elementToBeClickable(logoutButton));
        logoutButton.click();
    }

    public String getErrorMessage() {
        try {
            wait.until(ExpectedConditions.visibilityOf(errorMessage));
            return errorMessage.getText();
        } catch (Exception e) {
            try {
                wait.until(ExpectedConditions.visibilityOf(alertError));
                return alertError.getText();
            } catch (Exception ex) {
                return "";
            }
        }
    }

    public boolean isWelcomeMessageDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(welcomeMessage));
            return welcomeMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isOnLoginPage() {
        return driver.getCurrentUrl().contains("/login");
    }

    public boolean isOnDashboard() {
        return driver.getCurrentUrl().contains("/dashboard");
    }

    // Complete login action
    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLoginButton();
    }
}
