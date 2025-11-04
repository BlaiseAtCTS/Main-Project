package com.site.banking.hooks;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.time.Duration;

/**
 * Hooks class for Cucumber
 * Manages WebDriver setup and teardown before and after each scenario
 */
public class Hooks {
    
    private static WebDriver driver;
    private static final String BROWSER = System.getProperty("browser", "chrome");
    private static final int IMPLICIT_WAIT = 10;

    @Before
    public void setUp(Scenario scenario) {
        System.out.println("Starting scenario: " + scenario.getName());
        initializeDriver();
    }

    @After
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            // Take screenshot on failure
            byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            scenario.attach(screenshot, "image/png", "Screenshot on Failure");
            System.out.println("Scenario failed: " + scenario.getName());
        } else {
            System.out.println("Scenario passed: " + scenario.getName());
        }
        
        // Close browser
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }

    /**
     * Initialize WebDriver based on browser parameter
     */
    private void initializeDriver() {
        if (driver == null) {
            switch (BROWSER.toLowerCase()) {
                case "chrome":
                    WebDriverManager.chromedriver().setup();
                    ChromeOptions chromeOptions = new ChromeOptions();
                    chromeOptions.addArguments("--start-maximized");
                    chromeOptions.addArguments("--disable-notifications");
                    chromeOptions.addArguments("--disable-popup-blocking");
                    // Uncomment below for headless mode
                    // chromeOptions.addArguments("--headless");
                    driver = new ChromeDriver(chromeOptions);
                    break;

                case "firefox":
                    WebDriverManager.firefoxdriver().setup();
                    FirefoxOptions firefoxOptions = new FirefoxOptions();
                    // Uncomment below for headless mode
                    // firefoxOptions.addArguments("--headless");
                    driver = new FirefoxDriver(firefoxOptions);
                    driver.manage().window().maximize();
                    break;

                case "edge":
                    WebDriverManager.edgedriver().setup();
                    EdgeOptions edgeOptions = new EdgeOptions();
                    edgeOptions.addArguments("--start-maximized");
                    // Uncomment below for headless mode
                    // edgeOptions.addArguments("--headless");
                    driver = new EdgeDriver(edgeOptions);
                    break;

                default:
                    throw new IllegalArgumentException("Browser not supported: " + BROWSER);
            }

            // Set implicit wait
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(IMPLICIT_WAIT));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        }
    }

    /**
     * Get WebDriver instance
     * @return WebDriver instance
     */
    public static WebDriver getDriver() {
        return driver;
    }
}
