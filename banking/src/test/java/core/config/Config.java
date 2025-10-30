package core.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Config {
    private static final Properties PROPS = new Properties();
    static {
        try (InputStream in = Config.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (in != null) PROPS.load(in);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config.properties", e);
        }
    }
    public static String baseUrl() { return System.getProperty("baseUrl", PROPS.getProperty("baseUrl")); }
    public static String browser() { return System.getProperty("browser", PROPS.getProperty("browser", "chrome")); }
    public static boolean headless() { return Boolean.parseBoolean(System.getProperty("headless", PROPS.getProperty("headless", "true"))); }
    public static int explicitWaitSec() { return Integer.parseInt(PROPS.getProperty("explicitWaitSec", "15")); }
    public static boolean screenshotOnFailure(){ return Boolean.parseBoolean(PROPS.getProperty("screenshotOnFailure","true")); }
    public static String loginPageUrl() { return System.getProperty("loginPageUrl", PROPS.getProperty("loginPageUrl")); }
    public static String registerPageUrl() { return System.getProperty("registerPageUrl", PROPS.getProperty("registerPageUrl")); }
    public static String userDashboardPageUrl() { return System.getProperty("userDashboardPageUrl", PROPS.getProperty("userDashboardPageUrl")); }
    public static String userAccountPageUrl() { return System.getProperty("userAccountPageUrl", PROPS.getProperty("userAccountPageUrl")); }
    public static String userCreateAccountPageUrl() { return System.getProperty("userCreateAccountPageUrl", PROPS.getProperty("userCreateAccountPageUrl")); }
    public static String userDepositPageUrl() { return System.getProperty("userDepositPageUrl", PROPS.getProperty("userDepositPageUrl")); }
    public static String userWithdrawPageUrl() { return System.getProperty("userWithdrawPageUrl", PROPS.getProperty("userWithdrawPageUrl")); }
    public static String userTransactionPageUrl() { return System.getProperty("userTransactionPageUrl", PROPS.getProperty("userTransactionPageUrl")); }

    public static String adminDashboardPageUrl() { return System.getProperty("adminDashboardPageUrl", PROPS.getProperty("adminDashboardPageUrl")); }
    public static String apiBaseUrl() { return System.getProperty("apiBaseUrl", PROPS.getProperty("apiBaseUrl")); }
}
