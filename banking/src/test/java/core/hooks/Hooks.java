package core.hooks;

import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import core.browser.Browser;
import core.config.Config;
import core.driver.DriverFactory;
import core.driver.DriverManager;
import core.listener.Listener;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.an.E;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Parameters;

public class Hooks {
    @Before // for each scenario
    public void browserInit(Scenario scenario) {
        RemoteWebDriver driver = DriverFactory.newDriver(Browser.getBrowserName(), Config.headless());
        driver.manage().window().setSize(new Dimension(800, 600));
        DriverManager.set(driver);
    }

    @After // for each scenario
    public void tearDown(Scenario scenario) {
        DriverManager.unload();
    }
}
