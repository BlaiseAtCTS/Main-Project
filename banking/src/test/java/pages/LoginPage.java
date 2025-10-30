package pages;

import api.services.ApiServices;
import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import io.restassured.response.Response;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import payloads.AdminData;
import payloads.LoginData;

public class LoginPage {
    private By signUpLink = By.xpath("//a[.='Sign Up']");
    private By userNameField = By.id("userName");
    private By passwordField = By.id("password");
    private By signInButton = By.xpath("//button[@type='submit']");

    public void open() {
        DriverManager.get().get(Config.baseUrl());
    }

    public String loginPageUrl() {
        return Config.loginPageUrl();
    }

    public void clickSignUpLink() {
        DriverManager.get().findElement(signUpLink).click();
    }

    public void userEntersValidDataInLoginPage(String typeOfInvalidInput) {
        LoginData loginData = new LoginData();
        String passwordLocalValue = loginData.getPassword();

        DriverManager.get().findElement(userNameField).sendKeys(loginData.getUserName());

        if(typeOfInvalidInput != null && !typeOfInvalidInput.isEmpty()) {
            passwordLocalValue = "incorrectPassword";
        }
        System.out.println("Password: "+ passwordLocalValue);
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

    public Response apiPostRequest() {
        return new ApiServices().postRequest("/user/login", null, new LoginData());
    }
}
