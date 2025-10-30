package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import payloads.account.AccountTransferData;

public class UserTransactionPage {
    private By sourceAccount = By.id("sourceAccount");
    private By destinationAccount = By.id("destinationAccount");
    private By transferAmount = By.id("transferAmount");
    private By transferButton = By.xpath("//button[@type='submit']");
    private By status = By.xpath("//div[starts-with(@class, 'alert')]");

    public String userTransactionPageUrl() {
        return Config.userTransactionPageUrl();
    }

    public void selectAccountNumber() {
        Select select = new Select(DriverManager.get().findElement(sourceAccount));
        select.selectByIndex(0);
    }

    public void enterDestinationAccount() {
        AccountTransferData accountData = new AccountTransferData();
        DriverManager.get().findElement(destinationAccount).sendKeys(accountData.getDestinationAccountNumber());
    }

    public void enterTransferAmount() {
        AccountTransferData accountData = new AccountTransferData();
        DriverManager.get().findElement(transferAmount).sendKeys(accountData.getTransferAmount());
    }

    public void clickTransferButton() {
        ExplicitWait.getWait().until(ExpectedConditions.elementToBeClickable(transferButton));
        JavascriptExecutor executor = (JavascriptExecutor) DriverManager.get();
        executor.executeScript("arguments[0].scrollIntoView(true)", DriverManager.get().findElement(transferButton));
        executor.executeScript("arguments[0].click()", DriverManager.get().findElement(transferButton));
    }

    public boolean checkStatus() {
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfAllElementsLocatedBy(status));
        return DriverManager.get().findElement(status).isDisplayed();
    }
}
