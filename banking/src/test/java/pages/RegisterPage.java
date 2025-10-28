package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RegisterPage {
    private By firstName = By.id("firstName");
    private By lastName = By.id("lastName");
    private By userName = By.id("userName");
    private By email = By.id("email");
    private By phoneNumber = By.id("phoneNumber");
    private By dob = By.id("dob");
    private By address = By.id("address");
    private By password = By.id("password");
    private By registerButton = By.xpath("//button");
    private By statusMessage = By.xpath("//div[@role='alert']//child::p");

    public String registerPageUrl() {
        return Config.registerPageUrl();
    }

    public void enterFirstName(String string) {
        DriverManager.get().findElement(firstName).sendKeys(string);
    }

    public void enterLastName(String string) {
        DriverManager.get().findElement(lastName).sendKeys(string);
    }

    public void enterUserName(String string) {
        DriverManager.get().findElement(userName).sendKeys(string);
    }

    public void enterEmail(String string) {
        DriverManager.get().findElement(email).sendKeys(string);
    }

    public void enterPhoneNumber(String string) {
        DriverManager.get().findElement(phoneNumber).sendKeys(string);
    }

    public void enterDob(String string) {
        DriverManager.get().findElement(dob).sendKeys(string);
    }

    public void enterAddress(String string) {
        DriverManager.get().findElement(address).sendKeys(string);
    }

    public void enterPassword(String string) {
        DriverManager.get().findElement(password).sendKeys(string);
    }

    public void clickRegisterButton() {
        JavascriptExecutor executor = (JavascriptExecutor) DriverManager.get();
        executor.executeScript("arguments[0].scrollIntoView(true);", DriverManager.get().findElement(registerButton));
        executor.executeScript("arguments[0].click();", DriverManager.get().findElement(registerButton));
    }

    public void waitForLoginPage() {
        LoginPage loginPage = new LoginPage();
        ExplicitWait.getWait().until(ExpectedConditions.urlToBe(loginPage.loginPageUrl()));
    }

    public boolean checkForStatus() {
        return DriverManager.get().findElement(statusMessage).isDisplayed();
    }

    public String checkForEmailStatus() {
        return DriverManager.get().findElement(statusMessage).getText();
    }
}
