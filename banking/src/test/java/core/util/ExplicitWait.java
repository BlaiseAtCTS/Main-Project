package core.util;

import core.config.Config;
import core.driver.DriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ExplicitWait {
    public static WebDriverWait getWait() {
        return new WebDriverWait(DriverManager.get(), Duration.ofSeconds(Config.explicitWaitSec()));
    }
}
