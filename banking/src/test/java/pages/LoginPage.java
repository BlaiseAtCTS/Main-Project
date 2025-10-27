package pages;

import core.config.Config;
import core.driver.DriverManager;
import org.openqa.selenium.*;

public class LoginPage {
    private By signUpLink = By.xpath("//a[.='Sign Up']");
    private By userNameField = By.id("userName");
    private By passwordField = By.id("password");
    private By signInButton = By.xpath("//button[@type='submit']");

    public void open() {
        DriverManager.get().get(Config.baseUrl());
    }

    public String loginPageUrl() {
        return "http://localhost:4200/login";
    }

    public void clickSignUpLink() {
        DriverManager.get().findElement(signUpLink).click();
    }
}
