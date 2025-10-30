package runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
        dryRun = false,
        features = "src/test/resources/features/api",
        glue = { "steps" },
        snippets = CucumberOptions.SnippetType.CAMELCASE,
        tags = "@api_account_deposit",
        plugin = { "pretty" },
        monochrome = true
)
public class TestApiRunner extends AbstractTestNGCucumberTests {
}
