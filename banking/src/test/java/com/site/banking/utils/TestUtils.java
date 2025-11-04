package com.site.banking.utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.Properties;

/**
 * Utility class containing common helper methods for tests
 */
public class TestUtils {

    /**
     * Load properties from test.properties file
     */
    public static Properties loadProperties() {
        Properties properties = new Properties();
        try {
            FileInputStream fis = new FileInputStream("src/test/resources/test.properties");
            properties.load(fis);
            fis.close();
        } catch (IOException e) {
            System.err.println("Error loading test.properties: " + e.getMessage());
        }
        return properties;
    }

    /**
     * Wait for element to be visible
     */
    public static void waitForElementVisible(WebDriver driver, WebElement element, int timeoutSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
        wait.until(ExpectedConditions.visibilityOf(element));
    }

    /**
     * Wait for element to be clickable
     */
    public static void waitForElementClickable(WebDriver driver, WebElement element, int timeoutSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
        wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    /**
     * Wait for URL to contain specific text
     */
    public static void waitForUrlContains(WebDriver driver, String urlFragment, int timeoutSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
        wait.until(ExpectedConditions.urlContains(urlFragment));
    }

    /**
     * Get property value from test.properties
     */
    public static String getProperty(String key) {
        Properties properties = loadProperties();
        return properties.getProperty(key, "");
    }

    /**
     * Generate random email
     */
    public static String generateRandomEmail() {
        return "test" + System.currentTimeMillis() + "@test.com";
    }

    /**
     * Generate random phone number
     */
    public static String generateRandomPhone() {
        return "98765" + (int)(Math.random() * 90000 + 10000);
    }

    /**
     * Wait for specified milliseconds
     */
    public static void waitFor(long milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
