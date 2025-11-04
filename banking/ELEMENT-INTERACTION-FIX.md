# Selenium Element Interaction Fix

## 🐛 Problem Encountered

```
org.openqa.selenium.ElementNotInteractableException: element not interactable
```

This error occurred when trying to interact with input fields on the login page, even though Selenium could successfully locate the elements by ID.

---

## 🔍 Root Causes

### 1. **Angular Component Rendering Delay**
Angular components (especially custom `ui-input` wrappers) take time to fully render and become interactive. The DOM element exists but may not be ready for interaction immediately.

### 2. **Element Visibility Issues**
Elements might be:
- Off-screen and need scrolling
- Covered by other elements
- Not fully loaded in the viewport

### 3. **CDP Version Warning (Secondary Issue)**
```
WARNING: Unable to find CDP implementation matching 140
```
This warning is non-critical but indicates Selenium's Chrome DevTools Protocol version doesn't match your Chrome browser version (140.x). It doesn't prevent tests from running.

---

## ✅ Solutions Applied

### 1. **Enhanced Wait Conditions**

#### Before (LoginPage.java)
```java
public void enterUsername(String username) {
    wait.until(ExpectedConditions.elementToBeClickable(usernameInput));
    usernameInput.sendKeys(username);
}
```

#### After (LoginPage.java)
```java
public void enterUsername(String username) {
    // Wait for element to be visible and interactable
    wait.until(ExpectedConditions.visibilityOf(usernameInput));
    wait.until(ExpectedConditions.elementToBeClickable(usernameInput));
    
    // Scroll element into view if needed
    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", usernameInput);
    
    // Small wait after scroll
    try {
        Thread.sleep(500);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    
    // Clear and enter username
    usernameInput.clear();
    usernameInput.sendKeys(username);
}
```

### 2. **Page Load Wait**

Added explicit wait after navigation to ensure Angular app is fully loaded:

```java
public void navigateToLoginPage(String baseUrl) {
    driver.get(baseUrl + "/login");
    
    // Wait for Angular to load
    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    
    // Wait for page to be fully loaded
    wait.until(ExpectedConditions.visibilityOf(usernameInput));
}
```

### 3. **JavaScript Click Fallback**

For button clicks, added JavaScript click as fallback:

```java
public void clickLoginButton() {
    wait.until(ExpectedConditions.elementToBeClickable(loginButton));
    
    // Scroll into view
    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", loginButton);
    
    // Small wait
    try {
        Thread.sleep(300);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    
    // Click using JavaScript if normal click fails
    try {
        loginButton.click();
    } catch (Exception e) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", loginButton);
    }
}
```

---

## 📋 Changes Applied to Files

### LoginPage.java
✅ Added `JavascriptExecutor` import  
✅ Enhanced `navigateToLoginPage()` with wait  
✅ Enhanced `enterUsername()` with scroll and multiple waits  
✅ Enhanced `enterPassword()` with scroll and multiple waits  
✅ Enhanced `clickLoginButton()` with scroll and JS click fallback  

### RegisterPage.java
✅ Added `JavascriptExecutor` import  
✅ Enhanced `navigateToRegisterPage()` with wait  
✅ Enhanced all input methods with scroll and clickability check  

---

## 🎯 How These Fixes Work

### 1. **Multiple Wait Conditions**
```java
wait.until(ExpectedConditions.visibilityOf(element));        // Element is visible
wait.until(ExpectedConditions.elementToBeClickable(element)); // Element is clickable
```
Ensures the element is both visible AND ready for interaction.

### 2. **ScrollIntoView**
```java
((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
```
Scrolls the element into the viewport, ensuring it's not off-screen.

### 3. **Small Delays**
```java
Thread.sleep(500);
```
Gives the browser time to complete animations and rendering after scrolling.

### 4. **JavaScript Click Fallback**
```java
try {
    element.click();
} catch (Exception e) {
    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
}
```
If normal click fails (element intercepted, etc.), JavaScript click bypasses visual layers.

---

## 🔧 About the CDP Warning (Optional Fix)

The CDP warning is **not critical** but can be fixed if desired:

### Option 1: Update Selenium (Recommended)
Wait for Selenium to release support for Chrome 140, or use an older Chrome version.

### Option 2: Add Specific DevTools Version
Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-devtools-v140</artifactId>
    <version>4.31.0</version>
    <scope>test</scope>
</dependency>
```
*(Note: v140 might not exist yet; check Maven Central)*

### Option 3: Ignore the Warning
The warning doesn't affect test execution - CDP features just won't be available.

---

## 🧪 Testing the Fixes

### 1. Ensure Frontend is Running
```powershell
cd FrontEND
ng serve
```

### 2. Run Tests
```powershell
cd banking
.\mvnw.cmd clean test
```

### 3. Expected Behavior
- ✅ No `ElementNotInteractableException` errors
- ✅ Elements are scrolled into view before interaction
- ✅ Tests wait for Angular to fully load
- ✅ Inputs are cleared before entering new values
- ⚠️ CDP warning may still appear (can be ignored)

---

## 📊 Comparison

| Issue | Before | After |
|-------|--------|-------|
| **Wait Strategy** | Single wait (clickable) | Multiple waits (visible + clickable) |
| **Scrolling** | ❌ None | ✅ ScrollIntoView |
| **Click Method** | Normal click only | Normal + JS fallback |
| **Page Load** | No explicit wait | 2-second wait + element check |
| **Input Clear** | Commented out | ✅ Active |

---

## 💡 Best Practices Applied

1. ✅ **Explicit Waits**: Used instead of implicit waits for specific conditions
2. ✅ **Scroll Into View**: Ensures elements are visible before interaction
3. ✅ **Multiple Wait Conditions**: Visibility + Clickability checks
4. ✅ **JavaScript Fallbacks**: For when normal actions fail
5. ✅ **Clear Before Type**: Ensures clean state for input fields
6. ✅ **Page Load Waits**: Gives Angular time to initialize

---

## 🚀 Additional Tips

### For Slower Connections
Increase wait timeouts in page constructors:
```java
this.wait = new WebDriverWait(driver, Duration.ofSeconds(20)); // Increased from 10
```

### For Debugging
Add more logging:
```java
System.out.println("Attempting to interact with: " + usernameInput);
wait.until(ExpectedConditions.visibilityOf(usernameInput));
System.out.println("Element is now visible");
```

### For Headless Mode
If running headless, some delays might need adjustment:
```java
Thread.sleep(1000); // Increase from 500ms
```

---

## ✅ Summary

All Page Object Model classes have been updated with:
- ✅ Better wait strategies
- ✅ Scroll into view for all interactions
- ✅ JavaScript fallbacks for clicks
- ✅ Page load waits for Angular
- ✅ Proper element clearing before input

The `ElementNotInteractableException` should now be resolved! 🎉
