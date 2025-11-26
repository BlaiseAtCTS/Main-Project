package runner;

import core.config.Config;
import core.driver.DriverFactory;
import core.driver.DriverManager;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Parameters;

@CucumberOptions(
        dryRun = false,
        features = "src/test/resources/features",
        glue = { "steps", "core.hooks" },
        snippets = CucumberOptions.SnippetType.CAMELCASE,
        tags = "@login and @regression",
        plugin = { "pretty" },
        monochrome = true
)
public class TestRunner extends AbstractTestNGCucumberTests {
    @Parameters("browser")
    @BeforeTest
    public void browserInit(String browser) {
        System.out.println("Using "+browser);
        RemoteWebDriver driver = DriverFactory.newDriver(browser, Config.headless());
//        driver.manage().window().maximize();
        DriverManager.set(driver);
    }
}
