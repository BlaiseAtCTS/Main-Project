package core.browser;

import lombok.Getter;
import lombok.Setter;

public class Browser {
    private static ThreadLocal<String> browserName = new ThreadLocal<>();

    public static void setBrowserName(String browser) {
        browserName.set(browser);
    }

    public static String getBrowserName() {
        return browserName.get();
    }

    public static void unload() {
        browserName.remove();
    }
}
