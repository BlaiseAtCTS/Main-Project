package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import pages.payloads.AdminData;
import pages.payloads.LoginData;

public class LoginPage {
    private By signUpLink = By.xpath("//a[.='Sign Up']");
    private By userNameField = By.id("userName");
    private By passwordField = By.id("password");
    private By signInButton = By.xpath("//button[@type='submit']");
    private By statusMessage = By.xpath("//div[@role='alert']");

    public void open() {
        DriverManager.get().get(Config.baseUrl());
    }

    public String loginPageUrl() {
        return Config.baseUrl() + "/login";
    }

    public void clickSignUpLink() {
        DriverManager.get().findElement(signUpLink).click();
    }

    public void userEntersValidDataInLoginPage(String typeOfInvalidInput) {
        LoginData loginData = new LoginData();
        String usernameLocalValue = loginData.getUserName();
        String passwordLocalValue = loginData.getPassword();

        if(typeOfInvalidInput != null && typeOfInvalidInput.equalsIgnoreCase("username")) {
            usernameLocalValue = "adamsmith0";
        }
        else if(typeOfInvalidInput != null && typeOfInvalidInput.equalsIgnoreCase("password")) {
            passwordLocalValue = "incorrectPassword";
        }
        DriverManager.get().findElement(userNameField).sendKeys(usernameLocalValue);
        DriverManager.get().findElement(passwordField).sendKeys(passwordLocalValue);
    }

    public void userEntersInvalidInLoginPage(String typeOfInvalidInput) {
        this.userEntersValidDataInLoginPage(typeOfInvalidInput);
    }

    public void clickSignInButton() {
        DriverManager.get().findElement(signInButton).click();
    }

    public void waitForUserDashboardPage() {
        UserDashboardPage userDashboardPage = new UserDashboardPage();
        ExplicitWait.getWait().until(ExpectedConditions.urlToBe(userDashboardPage.userDashboardPageUrl()));
    }

    public boolean checkSignInButtonIsDisabled() {
        return DriverManager.get().findElement(signInButton).isEnabled();
    }

    public void adminEntersUsername() {
        AdminData adminData = new AdminData();
        DriverManager.get().findElement(userNameField).sendKeys(adminData.getUserName());
    }

    public void adminEntersPassword() {
        AdminData adminData = new AdminData();
        DriverManager.get().findElement(passwordField).sendKeys(adminData.getPassword());
    }

    public String getStatusMessage() {
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfElementLocated(statusMessage));
        System.out.println(DriverManager.get().findElement(statusMessage).getText());
        return DriverManager.get().findElement(statusMessage).getText();
    }
}
