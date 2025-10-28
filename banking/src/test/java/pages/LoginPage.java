package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;

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

    public void enterUserName(String string) {
        DriverManager.get().findElement(userNameField).sendKeys(string);
    }

    public void enterPassword(String string) {
        DriverManager.get().findElement(passwordField).sendKeys(string);
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
}
