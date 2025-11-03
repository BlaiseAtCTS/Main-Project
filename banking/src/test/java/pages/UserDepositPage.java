package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import pages.payloads.account.AccountDepositData;

public class UserDepositPage {
    private By accountNumber = By.id("accountNumber");
    private By amount = By.id("amount");
    private By depositNowButton = By.xpath("//button[@type='submit']");
    private By status = By.xpath("//div[@role='alert']");

    public String userDepositPageUrl() {
        return Config.baseUrl() + "/deposit";
    }

    public void selectAccountNumber() {
        Select select = new Select(DriverManager.get().findElement(accountNumber));
        select.selectByIndex(1);
    }

    public void enterDepositAmount() {
        AccountDepositData accountData = new AccountDepositData();
        DriverManager.get().findElement(amount).sendKeys(accountData.getAmount());
    }

    public void enterDepositAmount(String arg0) {
        DriverManager.get().findElement(amount).sendKeys(arg0);
    }

    public void clickDepositNowButton() {
        ExplicitWait.getWait().until(ExpectedConditions.elementToBeClickable(depositNowButton));
        DriverManager.get().findElement(depositNowButton).click();
    }

    public String checkStatus() {
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfAllElementsLocatedBy(status));
        return DriverManager.get().findElement(status).getText();
    }
}
