package com.site.banking.runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

/**
 * TestNG Test Runner for Cucumber Tests
 * Configures and runs all Cucumber feature files
 */
@CucumberOptions(
        features = "src/test/resources/features/",           // Path to feature files
        glue = {
                "com.site.banking.stepdefinitions",         // Package containing step definitions
                "com.site.banking.hooks"                    // Package containing hooks
        },
        tags = "@Smoke",
        plugin = {
                "pretty",                                    // Console output formatting
                "html:target/cucumber-reports/cucumber.html", // HTML report
                "json:target/cucumber-reports/cucumber.json", // JSON report
                "junit:target/cucumber-reports/cucumber.xml"  // JUnit XML report
        },
        monochrome = true,                                   // Readable console output
        dryRun = false                              // Set to true to check mapping without execution
)
public class TestRunner extends AbstractTestNGCucumberTests {

    /**
     * This method enables parallel execution of scenarios
     * Uncomment to run scenarios in parallel
     */
    @Override
    @DataProvider(parallel = false)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
