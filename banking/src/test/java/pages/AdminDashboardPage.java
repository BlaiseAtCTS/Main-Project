package pages;

import core.config.Config;
import core.driver.DriverManager;
import core.util.ExplicitWait;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import pages.payloads.AdminData;

public class AdminDashboardPage {
    public String adminDashboardPageUrl() {
        return Config.baseUrl() + "/admin/dashboard";
    }

    public void clickAction() {
        AdminData adminData = new AdminData();
        DriverManager.get().findElement(By.xpath("(//button[@title='" + adminData.getAction() + "'])[1]")).click();
    }

    public void handleAlert() {
        ExplicitWait.getWait().until(ExpectedConditions.alertIsPresent());
        Alert alert = DriverManager.get().switchTo().alert();
        alert.accept();
    }

    public boolean checkStatus() {
        ExplicitWait.getWait().until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));
        return DriverManager.get().findElement(By.xpath("//div[@role='alert']")).isDisplayed();
    }

    public void waitForDashboardPage() {
        ExplicitWait.getWait().until(ExpectedConditions.urlToBe(adminDashboardPageUrl()));
    }
}