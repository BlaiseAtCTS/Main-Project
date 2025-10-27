package core.driver;

import org.openqa.selenium.remote.RemoteWebDriver;

public final class DriverManager {
    private static final ThreadLocal<RemoteWebDriver> threadLocal = new ThreadLocal<>();

    private DriverManager() {
    }

    public static void set(RemoteWebDriver driver) {
        threadLocal.set(driver);
    }

    public static RemoteWebDriver get() {
        return threadLocal.get();
    }

    public static String getCurrUrl() {
        RemoteWebDriver remoteWebDriver = get();
        return remoteWebDriver.getCurrentUrl();
    }

    public static void unload() {
        threadLocal.get().quit();

        threadLocal.remove();
    }
}