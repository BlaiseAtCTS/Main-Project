package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

import java.sql.Driver;

public class UserDashboardPage {

    public String userDashboardPageUrl() {
        return Config.userDashboardPageUrl();
    }

    public void clicksOnAction(String arg0) {
        UserAccountPage userAccountPage = new UserAccountPage();
        DriverManager.get().findElement(By.xpath("//button[.='" + arg0 + "']")).click();
        ExplicitWait.getWait().until(ExpectedConditions.not(ExpectedConditions.urlToBe(userDashboardPageUrl())));
    }
}
