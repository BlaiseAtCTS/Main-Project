package core.driver;

import core.config.Config;
import loaders.JSONLoader;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URL;

public final class DriverFactory {
    private DriverFactory(){}

    public static RemoteWebDriver newDriver(String browser, boolean headless){
        return switch (browser.toLowerCase()){
            case "chrome" -> createChrome(headless);
            case "firefox" -> createFirefox(headless);
            case "edge" -> createEdge(headless);
            default -> throw new IllegalArgumentException("Unsupported browser: " + browser);
        };
    }

    private static RemoteWebDriver createChrome(boolean headless){
        ChromeOptions options = new ChromeOptions();
        if (headless) {
            options.addArguments("--headless=new","--no-sandbox","--disable-dev-shm-usage");
        }
        try {
            URL hubUrl = new URL(Config.hubUrl());
            return new RemoteWebDriver(hubUrl, options);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    private static RemoteWebDriver createFirefox(boolean headless){
        FirefoxOptions options = new FirefoxOptions();
        if (headless) {
            options.addArguments("-headless");
        }
        try {
            URL hubUrl = new URL(Config.hubUrl());
            return new RemoteWebDriver(hubUrl, options);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    private static RemoteWebDriver createEdge(boolean headless){
        EdgeOptions options = new EdgeOptions();
        if (headless) {
            options.addArguments("--headless=new");
        }
        try {
            URL hubUrl = new URL(Config.hubUrl());
            return new RemoteWebDriver(hubUrl, options);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }
}