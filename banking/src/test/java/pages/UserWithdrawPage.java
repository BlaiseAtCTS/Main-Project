package pages;

import api.services.ApiServices;
import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import io.restassured.response.Response;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import payloads.account.AccountDepositData;
import payloads.account.AccountWithdrawData;

public class UserWithdrawPage {
    private By accountNumber = By.id("accountNumber");
    private By amount = By.id("amount");
    private By withdrawNowButton = By.xpath("//button[@type='submit']");
    private By status = By.xpath("//div[@role='alert']");

    public String userWithdrawPageUrl() {
        return Config.userWithdrawPageUrl();
    }

    public void selectAccountNumber() {
        Select select = new Select(DriverManager.get().findElement(accountNumber));
        select.selectByIndex(1);
    }

    public void enterWithdrawAmount() {
        AccountWithdrawData accountData = new AccountWithdrawData();
        DriverManager.get().findElement(amount).sendKeys(accountData.getWithdrawAmount());
    }

    public void enterDepositAmount(String arg0) {
        DriverManager.get().findElement(amount).sendKeys(arg0);
    }

    public void clickDepositNowButton() {
        ExplicitWait.getWait().until(ExpectedConditions.elementToBeClickable(withdrawNowButton));
        DriverManager.get().findElement(withdrawNowButton).click();
    }

    public boolean checkStatus() {
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfAllElementsLocatedBy(status));
        return DriverManager.get().findElement(status).isDisplayed();
    }

    public Response apiPostRequest() {
        ApiServices apiServices = new ApiServices();
        apiServices.getToken();
        System.out.println("Token: "+apiServices.getToken());
        return apiServices.postRequest("/account/withdraw", apiServices.getToken(), new AccountDepositData());
    }
}
