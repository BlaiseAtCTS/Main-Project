package pages;

import api.services.ApiServices;
import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import io.restassured.response.Response;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import payloads.RegistrationData;

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

    public void userEntersValidDataInRegistrationPage(String typeOfInvalidInput) {
        RegistrationData registrationData = new RegistrationData();
        String emailLocalValue = registrationData.getEmail();
        String phoneNumberLocalValue = String.valueOf(registrationData.getPhoneNumber());
        String dobLocalValue = registrationData.getDob();

        DriverManager.get().findElement(firstName).sendKeys(registrationData.getFirstName());
        DriverManager.get().findElement(lastName).sendKeys(registrationData.getLastName());
        DriverManager.get().findElement(userName).sendKeys(registrationData.getUserName());

        if(typeOfInvalidInput != null && !typeOfInvalidInput.isEmpty()) {
            if(typeOfInvalidInput.equalsIgnoreCase("email")) {
                emailLocalValue = "example.com";
            } else if(typeOfInvalidInput.equalsIgnoreCase("phoneNumber")) {
                phoneNumberLocalValue = "1000";
            } else if(typeOfInvalidInput.equalsIgnoreCase("dob")) {
                dobLocalValue = "01-01-2020";
            }
        }

        DriverManager.get().findElement(email).sendKeys(emailLocalValue);
        DriverManager.get().findElement(phoneNumber).sendKeys(String.valueOf(phoneNumberLocalValue));
        DriverManager.get().findElement(dob).sendKeys(dobLocalValue);
        DriverManager.get().findElement(address).sendKeys(registrationData.getAddress());
        DriverManager.get().findElement(password).sendKeys(registrationData.getPassword());
    }

    public void userEntersInvalidDataInRegistrationPage(String typeOfInvalidInput) {
        this.userEntersValidDataInRegistrationPage(typeOfInvalidInput);
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
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfElementLocated(statusMessage));
        return DriverManager.get().findElement(statusMessage).isDisplayed();
    }

    public String checkForEmailStatus() {
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfElementLocated(statusMessage));
        return DriverManager.get().findElement(statusMessage).getText();
    }

    public Response apiPostRequest() {
//        9514772220
        RegistrationData registrationData = new RegistrationData();
        System.out.println("Username: " + registrationData.getUserName());
        ApiServices apiServices = new ApiServices();
        return apiServices.postRequest("/user/register", null, registrationData);
    }
}
