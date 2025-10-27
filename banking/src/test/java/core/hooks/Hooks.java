package core.hooks;

import core.config.Config;
import core.driver.DriverFactory;
import core.driver.DriverManager;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.openqa.selenium.remote.RemoteWebDriver;

public class Hooks {
    @Before
    public void browserInit() {
        RemoteWebDriver driver = DriverFactory.newDriver(Config.browser(), Config.headless());
        driver.manage().window().maximize();
        DriverManager.set(driver);
    }

    @After
    public void tearDown(Scenario scenario) {
        DriverManager.unload();
    }
}
