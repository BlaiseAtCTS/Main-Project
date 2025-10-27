package runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
        dryRun = false,
        features = "src/test/resources/features/register",
        glue = { "steps", "core.hooks" },
        snippets = CucumberOptions.SnippetType.CAMELCASE,
        tags = "@register2 or @register3 or @register4 or @register5",
        plugin = { "pretty" },
        monochrome = true
)
public class TestRunner extends AbstractTestNGCucumberTests {
}
