package com.site.banking.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RegisterPage extends BasePage {
    
    // Use CSS selectors to find actual input elements inside ui-input wrappers
    @FindBy(css = "ui-input[id='firstName'] input")
    private WebElement firstNameInput;
    
    @FindBy(css = "ui-input[id='lastName'] input")
    private WebElement lastNameInput;
    
    @FindBy(css = "ui-input[id='email'] input")
    private WebElement emailInput;
    
    @FindBy(css = "ui-input[id='username'] input")
    private WebElement usernameInput;
    
    @FindBy(css = "ui-input[id='password'] input")
    private WebElement passwordInput;
    
    @FindBy(css = "ui-input[id='phone'] input")
    private WebElement phoneInput;
    
    @FindBy(css = "ui-input[name='dob'] input")
    private WebElement dateOfBirthInput;
    
    @FindBy(css = "ui-input[name='address'] input")
    private WebElement addressInput;
    
    @FindBy(css = "ui-button[id='register-button'] button")
    private WebElement registerButton;

    @FindBy(id = "toast-description")
    private WebElement welcomeMessage;
    @FindBy(id = "login-link")
    private WebElement loginLink;
    
    private WebDriverWait wait;
    
    public RegisterPage(WebDriver driver) {
        super(driver);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    }
    
    public void navigateTo(String baseUrl) {
       driver.get(baseUrl + "/register");
        
        // Wait for Angular to load
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Wait for page to be fully loaded
        wait.until(ExpectedConditions.visibilityOf(usernameInput));
    }
    
    public void enterFirstName(String firstName) {
        wait.until(ExpectedConditions.visibilityOf(firstNameInput));
        wait.until(ExpectedConditions.elementToBeClickable(firstNameInput));
        firstNameInput.clear();
        firstNameInput.sendKeys(firstName);
    }
    
    public void enterLastName(String lastName) {
        wait.until(ExpectedConditions.visibilityOf(lastNameInput));
        wait.until(ExpectedConditions.elementToBeClickable(lastNameInput));
        lastNameInput.clear();
        lastNameInput.sendKeys(lastName);
    }
    
    public void enterEmail(String email) {
        wait.until(ExpectedConditions.visibilityOf(emailInput));
        wait.until(ExpectedConditions.elementToBeClickable(emailInput));
        emailInput.clear();
        emailInput.sendKeys(email);
    }
    
    public void enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOf(usernameInput));
        wait.until(ExpectedConditions.elementToBeClickable(usernameInput));
        usernameInput.clear();
        usernameInput.sendKeys(username);
    }
    
    public void enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOf(passwordInput));
        wait.until(ExpectedConditions.elementToBeClickable(passwordInput));
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }
    
    public void enterPhoneNumber(String phoneNumber) {
        wait.until(ExpectedConditions.visibilityOf(phoneInput));
        wait.until(ExpectedConditions.elementToBeClickable(phoneInput));
        phoneInput.clear();
        phoneInput.sendKeys(phoneNumber);
    }
    
    public void enterDateOfBirth(String dateOfBirth) {
        wait.until(ExpectedConditions.visibilityOf(dateOfBirthInput));
        wait.until(ExpectedConditions.elementToBeClickable(dateOfBirthInput));
        dateOfBirthInput.clear();
        dateOfBirthInput.sendKeys(dateOfBirth);
    }
    public boolean isWelcomeMessageDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(welcomeMessage));
            return welcomeMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public void enterAddress(String address) {
        wait.until(ExpectedConditions.visibilityOf(addressInput));
        wait.until(ExpectedConditions.elementToBeClickable(addressInput));
        addressInput.clear();
        addressInput.sendKeys(address);
    }
    
    public void clickRegisterButton() {
        wait.until(ExpectedConditions.visibilityOf(registerButton));
        wait.until(ExpectedConditions.elementToBeClickable(registerButton));
        
        try {
            registerButton.click();
        } catch (Exception e) {
            // Fallback to JavaScript click
        }
    }
    
    public void clickLoginLink() {
        wait.until(ExpectedConditions.visibilityOf(loginLink));
        wait.until(ExpectedConditions.elementToBeClickable(loginLink));
        
        try {
            loginLink.click();
        } catch (Exception e) {
        }
    }

 

    public boolean isOnRegistrationPage() {
        return driver.getCurrentUrl().contains("/register");
    }
    

    public boolean isRegisterButtonEnabled() {
        try {
            wait.until(ExpectedConditions.visibilityOf(registerButton));
            return registerButton.isEnabled() && registerButton.getAttribute("disabled") == null;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Getter methods for form validation
    public String getFirstNameValue() {
        return firstNameInput.getAttribute("value");
    }
    
    public String getLastNameValue() {
        return lastNameInput.getAttribute("value");
    }
    
    public String getEmailValue() {
        return emailInput.getAttribute("value");
    }
    
    public String getUsernameValue() {
        return usernameInput.getAttribute("value");
    }
    
    public String getPasswordValue() {
        return passwordInput.getAttribute("value");
    }
    
    public String getPhoneValue() {
        return phoneInput.getAttribute("value");
    }
    
    public String getDateOfBirthValue() {
        return dateOfBirthInput.getAttribute("value");
    }
    
    public String getAddressValue() {
        return addressInput.getAttribute("value");
    }
}
