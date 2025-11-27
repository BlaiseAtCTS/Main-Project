package runner;

import core.browser.Browser;
import core.config.Config;
import core.driver.DriverFactory;
import core.driver.DriverManager;
import core.hooks.Hooks;
import core.listener.Listener;
import io.cucumber.messages.types.Hook;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Listeners;
import org.testng.annotations.Parameters;

@Listeners(Listener.class)
@CucumberOptions(
        dryRun = false,
        features = "src/test/resources/features",
        glue = { "steps", "core.hooks" },
        snippets = CucumberOptions.SnippetType.CAMELCASE,
        tags = "@login_valid",
        plugin = { "pretty" },
        monochrome = true
)
public class TestRunner extends AbstractTestNGCucumberTests {
    @Parameters("browser")
    @BeforeTest
    public void browserInit(String browser) {
        System.out.println("Using "+browser);
        Browser.setBrowserName(browser);
    }
    @AfterTest
    public void tearDown() {
        Browser.unload();
    }
}
