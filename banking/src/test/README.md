# Banking Application - Cucumber BDD Test Suite

## Overview
This test suite contains automated tests for the Banking Application using:
- **Cucumber** for BDD (Behavior-Driven Development)
- **Selenium WebDriver** for browser automation
- **TestNG** as the test framework
- **Page Object Model (POM)** design pattern
- **WebDriverManager** for automatic driver management

## Project Structure

```
src/test/
├── java/
│   └── com/
│       └── site/
│           └── banking/
│               ├── hooks/
│               │   └── Hooks.java                    # Setup and teardown hooks
│               ├── pages/
│               │   ├── BasePage.java                 # Base page class
│               │   ├── LoginPage.java                # Login page object
│               │   └── RegisterPage.java             # Register page object
│               ├── runner/
│               │   └── TestRunner.java               # TestNG Cucumber runner
│               └── stepdefinitions/
│                   ├── LoginStepDefinitions.java     # Login step definitions
│                   └── RegisterStepDefinitions.java  # Register step definitions
└── resources/
    ├── features/
    │   ├── Login.feature                             # Login feature scenarios
    │   └── Register.feature                          # Register feature scenarios
    ├── test.properties                               # Test configuration
    └── testng.xml                                    # TestNG configuration
```

## Features Covered

### 1. Login Feature
- ✅ Login with valid credentials (multiple users)
- ✅ Login with invalid credentials
- ✅ Empty username/password validation
- ✅ Navigation to registration page
- ✅ Logout functionality

### 2. Registration Feature
- ✅ Register with valid details (multiple users)
- ✅ Registration with invalid details
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Password mismatch validation
- ✅ Phone number validation
- ✅ Duplicate email validation
- ✅ Navigation to login page

## Prerequisites

1. **Java 21** (or compatible version)
2. **Maven** for dependency management
3. **Chrome/Firefox/Edge browser** installed
4. **Frontend application** running on `http://localhost:4200`

## Installation

All dependencies are already added to `pom.xml`:
- Cucumber Java & TestNG
- Selenium WebDriver
- WebDriverManager
- TestNG

To download dependencies:
```bash
mvn clean install -DskipTests
```

## Running Tests

### 1. Run All Tests
```bash
mvn test
```

### 2. Run with TestNG XML
```bash
mvn test -DsuiteXmlFile=src/test/resources/testng.xml
```

### 3. Run Specific Feature
```bash
mvn test -Dcucumber.features="src/test/resources/features/Login.feature"
```

### 4. Run with Specific Browser
```bash
mvn test -Dbrowser=chrome
mvn test -Dbrowser=firefox
mvn test -Dbrowser=edge
```

### 5. Run with Custom Base URL
```bash
mvn test -DbaseUrl=http://localhost:4200
```

### 6. Run with Tags
Add tags to feature files (e.g., @smoke, @regression) and run:
```bash
mvn test -Dcucumber.filter.tags="@smoke"
mvn test -Dcucumber.filter.tags="@smoke or @regression"
```

### 7. Run from IDE (IntelliJ/Eclipse)
- Right-click on `TestRunner.java` → Run as TestNG Test
- Right-click on any `.feature` file → Run as Cucumber Feature

## Configuration

### test.properties
Modify `src/test/resources/test.properties` to change:
- Base URL
- Browser type
- Timeouts
- Screenshot settings

### Browser Selection
Set browser via system property or in Hooks.java:
```bash
-Dbrowser=chrome    # Default
-Dbrowser=firefox
-Dbrowser=edge
```

### Headless Mode
Uncomment the headless arguments in `Hooks.java` for headless execution:
```java
chromeOptions.addArguments("--headless");
```

## Reports

After test execution, reports are generated in:

1. **HTML Report**: `target/cucumber-reports/cucumber.html`
2. **JSON Report**: `target/cucumber-reports/cucumber.json`
3. **XML Report**: `target/cucumber-reports/cucumber.xml`

To view HTML report:
```bash
start target/cucumber-reports/cucumber.html  # Windows
open target/cucumber-reports/cucumber.html   # Mac
xdg-open target/cucumber-reports/cucumber.html # Linux
```

## Page Object Model (POM)

### BasePage
- Common methods used across all pages
- WebDriver initialization with PageFactory

### LoginPage
- Element locators for login page
- Actions: enterUsername, enterPassword, clickLoginButton, etc.
- Validations: isOnLoginPage, isWelcomeMessageDisplayed, etc.

### RegisterPage
- Element locators for registration page
- Actions: enterFirstName, enterLastName, enterEmail, etc.
- Validations: isOnRegisterPage, getErrorMessage, etc.

## Hooks

The `Hooks.java` class manages:
- **@Before**: WebDriver initialization before each scenario
- **@After**: WebDriver cleanup and screenshot capture on failure
- Browser configuration (Chrome, Firefox, Edge)
- Implicit/explicit waits setup

## Step Definitions

### LoginStepDefinitions
Implements all steps from `Login.feature`:
- Given I am on the login page
- When I enter username/password
- Then I should be redirected to dashboard

### RegisterStepDefinitions
Implements all steps from `Register.feature`:
- Given I am on the registration page
- When I enter registration details
- Then I should see success/error message

## Adding New Tests

### 1. Create Feature File
Add new `.feature` file in `src/test/resources/features/`:
```gherkin
Feature: New Feature Name
  Scenario: Test scenario
    Given precondition
    When action
    Then expected result
```

### 2. Create Page Object
Add new page class in `src/test/java/com/site/banking/pages/`:
```java
public class NewPage extends BasePage {
    @FindBy(id = "elementId")
    private WebElement element;
    
    public NewPage(WebDriver driver) {
        super(driver);
    }
}
```

### 3. Create Step Definitions
Add new step definition class in `src/test/java/com/site/banking/stepdefinitions/`:
```java
public class NewStepDefinitions {
    private WebDriver driver = Hooks.getDriver();
    private NewPage newPage = new NewPage(driver);
    
    @Given("step definition")
    public void stepDefinition() {
        // Implementation
    }
}
```

## Troubleshooting

### Issue: WebDriver not found
**Solution**: WebDriverManager handles this automatically. Ensure internet connection.

### Issue: Element not found
**Solution**: 
- Check element locators in page objects
- Increase explicit wait time
- Verify frontend application is running

### Issue: Tests fail on CI/CD
**Solution**: 
- Enable headless mode
- Increase timeouts
- Check browser compatibility

### Issue: Screenshot not captured
**Solution**: Verify the Hooks @After method is working and check target/cucumber-reports/

## Best Practices

1. ✅ Use Page Object Model for maintainability
2. ✅ Use explicit waits instead of Thread.sleep()
3. ✅ Keep feature files simple and readable
4. ✅ Use descriptive step names
5. ✅ Implement proper error handling
6. ✅ Take screenshots on failures
7. ✅ Use tags for test organization
8. ✅ Keep test data in examples tables
9. ✅ Use Background for common steps
10. ✅ Follow naming conventions

## Notes

- Update element locators in page objects if frontend HTML changes
- Ensure the Angular application is running before executing tests
- The tests use `http://localhost:4200` as the default base URL
- Adjust locators (id, css, xpath) based on actual frontend implementation
- For parallel execution, set `parallel="methods"` in testng.xml

## Contact

For issues or questions regarding the test suite, please contact the QA team.
