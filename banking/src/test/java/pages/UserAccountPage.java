package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import pages.payloads.account.AccountCreateData;

public class UserAccountPage {
    private By accountType = By.id("accountType");
    private By initialBalance = By.id("initialBalance");
    private By submitRequestButton = By.xpath("//button[@type='submit']");
    private By status = By.xpath("//div[@role='alert']");

    public String userAccountPageUrl() {
        return Config.baseUrl() + "/accounts";
    }

    public String userCreateAccountPageUrl() {
        return Config.baseUrl() + "/accounts/create";
    }

    public void clicksOnAccountType(String arg0) {
        Select select = new Select(DriverManager.get().findElement(accountType));
        select.selectByVisibleText(arg0);
    }

    public void userEntersAmount() {
        AccountCreateData accountData = new AccountCreateData();
        DriverManager.get().findElement(initialBalance).clear();
        DriverManager.get().findElement(initialBalance).sendKeys(accountData.getInitialBalance());
    }

    public void clicksOnSubmitRequestButton() {
        JavascriptExecutor executor = (JavascriptExecutor) DriverManager.get();
        executor.executeScript("arguments[0].scrollIntoView(true)", DriverManager.get().findElement(submitRequestButton));
        executor.executeScript("arguments[0].click()", DriverManager.get().findElement(submitRequestButton));
    }
    public void enterInitialBalance(String arg0) {
        DriverManager.get().findElement(initialBalance).clear();
        DriverManager.get().findElement(initialBalance).sendKeys(arg0);
    }

    public void amountType(String amountType) {
        if(amountType.equalsIgnoreCase("initial")) {
            this.userEntersAmount();
        } else if(amountType.equalsIgnoreCase("deposit")) {
            UserDepositPage userDepositPage = new UserDepositPage();
            userDepositPage.enterDepositAmount();
        } else if(amountType.equalsIgnoreCase("withdraw")) {
            UserWithdrawPage userWithdrawPage = new UserWithdrawPage();
            userWithdrawPage.enterWithdrawAmount();
        } else if(amountType.equalsIgnoreCase("transfer")) {
            UserTransactionPage userTransactionPage = new UserTransactionPage();
            userTransactionPage.enterTransferAmount();
        }
    }

    public String checkStatus() {
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfAllElementsLocatedBy(status));
        return DriverManager.get().findElement(status).getText();
    }
}
