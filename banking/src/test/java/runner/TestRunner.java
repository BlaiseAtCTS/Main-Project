package runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
        dryRun = false,
        features = "src/test/resources/features",
        glue = { "steps", "core.hooks" },
        snippets = CucumberOptions.SnippetType.CAMELCASE,
        tags = "@action",
        plugin = { "pretty" },
        monochrome = true
)
public class TestRunner extends AbstractTestNGCucumberTests {
}
