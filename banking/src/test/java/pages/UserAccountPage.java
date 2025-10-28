package pages;

import core.config.Config;
import core.driver.DriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.Select;

public class UserAccountPage {
    private By accountType = By.id("accountType");
    private By initialBalance = By.id("initialBalance");
    private By submitRequestButton = By.xpath("//button[@type='submit']");

    public String userAccountPageUrl() {
        return Config.userAccountPageUrl();
    }

    public String userCreateAccountPageUrl() {
        return Config.userCreateAccountPageUrl();
    }

    public void clicksOnAccountType(String arg0) {
        Select select = new Select(DriverManager.get().findElement(accountType));
        select.selectByVisibleText(arg0);
    }

    public void enterInitialBalance(String arg0) {
        DriverManager.get().findElement(initialBalance).clear();
        DriverManager.get().findElement(initialBalance).sendKeys(arg0);
    }

    public void clicksOnSubmitRequestButton() {
        JavascriptExecutor executor = (JavascriptExecutor) DriverManager.get();
        executor.executeScript("arguments[0].scrollIntoView(true)", DriverManager.get().findElement(submitRequestButton));
        executor.executeScript("arguments[0].click()", DriverManager.get().findElement(submitRequestButton));
    }
}
