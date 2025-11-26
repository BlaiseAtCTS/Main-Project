package core.hooks;

import core.config.Config;
import core.driver.DriverFactory;
import core.driver.DriverManager;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Parameters;

public class Hooks {
    @After
    public void tearDown(Scenario scenario) {
        DriverManager.unload();
    }
}
