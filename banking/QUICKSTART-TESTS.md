# Quick Start Guide - Running Cucumber Tests

## Step 1: Install Dependencies
```bash
cd banking
mvn clean install -DskipTests
```

## Step 2: Start Frontend Application
Make sure your Angular frontend is running:
```bash
cd FrontEND
ng serve
```
The app should be accessible at: http://localhost:4200

## Step 3: Run Tests

### Option A: Run All Tests
```bash
cd banking
mvn test
```

### Option B: Run from IDE
1. Open `TestRunner.java` in your IDE
2. Right-click and select "Run as TestNG Test"

### Option C: Run Specific Feature
```bash
mvn test -Dcucumber.features="src/test/resources/features/Login.feature"
```

### Option D: Run with Different Browser
```bash
mvn test -Dbrowser=chrome
mvn test -Dbrowser=firefox
mvn test -Dbrowser=edge
```

## Step 4: View Reports
After execution, open the HTML report:
```bash
start target\cucumber-reports\cucumber.html
```

## Test Structure

```
Features:
├── Login.feature       - Login scenarios with valid/invalid credentials
└── Register.feature    - Registration scenarios with validation

Page Objects:
├── BasePage.java       - Common page methods
├── LoginPage.java      - Login page elements and actions
└── RegisterPage.java   - Register page elements and actions

Step Definitions:
├── LoginStepDefinitions.java       - Login step implementations
└── RegisterStepDefinitions.java    - Register step implementations

Hooks:
└── Hooks.java         - Setup (before) and Teardown (after) logic

Runner:
└── TestRunner.java    - TestNG Cucumber test runner
```

## Important Notes

1. **Update Element Locators**: The page objects use generic element IDs. Update them based on your actual frontend HTML:
   - Login page: Update selectors in `LoginPage.java`
   - Register page: Update selectors in `RegisterPage.java`

2. **Frontend Must Be Running**: Tests require the Angular app at `http://localhost:4200`

3. **WebDriver Auto-Download**: WebDriverManager automatically downloads browser drivers

4. **Screenshots**: Captured automatically on test failure in `target/cucumber-reports/`

## Customization

### Change Base URL
Edit `test.properties` or pass as parameter:
```bash
mvn test -DbaseUrl=http://your-url:port
```

### Change Browser
Edit `test.properties` or pass as parameter:
```bash
mvn test -Dbrowser=firefox
```

### Enable Headless Mode
Uncomment headless options in `Hooks.java`:
```java
chromeOptions.addArguments("--headless");
```

## Troubleshooting

**Problem**: Element not found
- Solution: Update element selectors in page objects to match your frontend

**Problem**: Tests run but fail
- Solution: Check if frontend is running on http://localhost:4200

**Problem**: Browser doesn't open
- Solution: Check internet connection (WebDriverManager needs to download drivers)

## Next Steps

1. ✅ Update element locators in page objects based on actual frontend HTML
2. ✅ Add more test scenarios to feature files
3. ✅ Implement additional page objects for other features
4. ✅ Add tags (@smoke, @regression) for test organization
5. ✅ Integrate with CI/CD pipeline

## Example: Adding a New Test

1. **Add scenario to feature file** (e.g., Login.feature):
```gherkin
Scenario: Remember me functionality
  When I enter username "test@test.com"
  And I enter password "Test@123"
  And I check the remember me checkbox
  And I click on the login button
  Then I should remain logged in on next visit
```

2. **Add methods to page object** (LoginPage.java):
```java
@FindBy(id = "rememberMe")
private WebElement rememberMeCheckbox;

public void checkRememberMe() {
    rememberMeCheckbox.click();
}
```

3. **Add step definitions** (LoginStepDefinitions.java):
```java
@And("I check the remember me checkbox")
public void iCheckRememberMeCheckbox() {
    loginPage.checkRememberMe();
}
```

Happy Testing! 🚀
