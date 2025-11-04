package com.site.banking.pages;

/**
 * SAMPLE FILE - Element Locator Guide
 * 
 * This file demonstrates how to update element locators in Page Objects
 * based on your actual frontend HTML structure.
 * 
 * =============================================================================
 * HOW TO FIND ELEMENT LOCATORS IN YOUR FRONTEND:
 * =============================================================================
 * 
 * 1. Open your Angular app in Chrome/Firefox
 * 2. Right-click on an element (e.g., username field) → Inspect
 * 3. Look at the HTML attributes: id, class, name, etc.
 * 4. Choose the most stable locator (preferably id)
 * 5. Update the @FindBy annotation in the respective page object
 * 
 * =============================================================================
 * LOCATOR STRATEGIES:
 * =============================================================================
 * 
 * 1. BY ID (Best Practice - Most Stable)
 * HTML: <input id="email" type="text" />
 * Code: @FindBy(id = "email")
 * 
 * 2. BY NAME
 * HTML: <input name="username" type="text" />
 * Code: @FindBy(name = "username")
 * 
 * 3. BY CSS SELECTOR (Flexible)
 * HTML: <button class="btn-primary login-btn">Login</button>
 * Code: @FindBy(css = "button.btn-primary.login-btn")
 * Or:   @FindBy(css = ".login-btn")
 * Or:   @FindBy(css = "button[type='submit']")
 * 
 * 4. BY XPATH (Most Powerful but Fragile)
 * HTML: <button>Login</button>
 * Code: @FindBy(xpath = "//button[text()='Login']")
 * 
 * 5. BY CLASS NAME
 * HTML: <div class="error-message">Error</div>
 * Code: @FindBy(className = "error-message")
 * 
 * 6. BY LINK TEXT
 * HTML: <a href="/register">Register</a>
 * Code: @FindBy(linkText = "Register")
 * 
 * 7. BY PARTIAL LINK TEXT
 * HTML: <a href="/register">Click here to Register</a>
 * Code: @FindBy(partialLinkText = "Register")
 * 
 * 8. BY TAG NAME
 * HTML: <h1>Welcome</h1>
 * Code: @FindBy(tagName = "h1")
 * 
 * =============================================================================
 * EXAMPLE: UPDATING LoginPage.java LOCATORS
 * =============================================================================
 * 
 * STEP 1: Inspect your login page HTML
 * STEP 2: Find actual element attributes
 * STEP 3: Update @FindBy annotations
 * 
 * Example Login Form HTML (inspect your actual frontend):
 * 
 * <form>
 *   <input id="username" name="email" type="email" placeholder="Email" />
 *   <input id="userPassword" name="password" type="password" placeholder="Password" />
 *   <button type="submit" class="btn-login">Sign In</button>
 *   <a routerLink="/register">Create Account</a>
 *   <div class="alert alert-danger">Invalid credentials</div>
 * </form>
 * 
 * Updated LoginPage.java would be:
 * 
 * @FindBy(id = "username")              // or name = "email"
 * private WebElement usernameInput;
 * 
 * @FindBy(id = "userPassword")          // or name = "password"
 * private WebElement passwordInput;
 * 
 * @FindBy(css = "button.btn-login")     // or css = "button[type='submit']"
 * private WebElement loginButton;
 * 
 * @FindBy(linkText = "Create Account")  // or partialLinkText = "Account"
 * private WebElement registerLink;
 * 
 * @FindBy(css = ".alert.alert-danger")  // or className = "alert-danger"
 * private WebElement errorMessage;
 * 
 * =============================================================================
 * EXAMPLE: UPDATING RegisterPage.java LOCATORS
 * =============================================================================
 * 
 * Example Registration Form HTML:
 * 
 * <form>
 *   <input id="fname" name="firstName" />
 *   <input id="lname" name="lastName" />
 *   <input id="emailAddress" name="email" type="email" />
 *   <input id="pass" name="password" type="password" />
 *   <input id="confirmPass" name="confirmPassword" type="password" />
 *   <input id="phoneNumber" name="phone" type="tel" />
 *   <button type="submit">Register</button>
 *   <div class="success-msg">Registration successful!</div>
 * </form>
 * 
 * Updated RegisterPage.java would be:
 * 
 * @FindBy(id = "fname")                 // or name = "firstName"
 * private WebElement firstNameInput;
 * 
 * @FindBy(id = "lname")                 // or name = "lastName"
 * private WebElement lastNameInput;
 * 
 * @FindBy(id = "emailAddress")          // or name = "email"
 * private WebElement emailInput;
 * 
 * @FindBy(id = "pass")                  // or name = "password"
 * private WebElement passwordInput;
 * 
 * @FindBy(id = "confirmPass")           // or name = "confirmPassword"
 * private WebElement confirmPasswordInput;
 * 
 * @FindBy(id = "phoneNumber")           // or name = "phone"
 * private WebElement phoneInput;
 * 
 * @FindBy(css = "button[type='submit']")
 * private WebElement registerButton;
 * 
 * @FindBy(css = ".success-msg")
 * private WebElement successMessage;
 * 
 * =============================================================================
 * TIPS FOR CHOOSING LOCATORS:
 * =============================================================================
 * 
 * Priority Order (Most Stable to Least Stable):
 * 1. id               - Best choice (unique and stable)
 * 2. name             - Good choice (usually unique)
 * 3. css selector     - Flexible (good for classes)
 * 4. linkText         - Good for links
 * 5. xpath            - Last resort (fragile to HTML changes)
 * 
 * Best Practices:
 * ✅ Prefer id over other locators
 * ✅ Use data-testid attributes in frontend for stable testing
 * ✅ Avoid complex xpath expressions
 * ✅ Use CSS selectors for dynamic elements
 * ✅ Keep locators maintainable and readable
 * 
 * =============================================================================
 * ANGULAR-SPECIFIC TIPS:
 * =============================================================================
 * 
 * 1. If using Angular forms with formControlName:
 *    <input formControlName="email" />
 *    Use: @FindBy(css = "input[formControlName='email']")
 * 
 * 2. If using Angular [(ngModel)]:
 *    <input [(ngModel)]="user.email" />
 *    Use: @FindBy(css = "input[ng-reflect-name='email']")
 *    Better: Add an id to the input and use that
 * 
 * 3. If using Angular Material:
 *    <mat-form-field>
 *      <input matInput placeholder="Email" id="email" />
 *    </mat-form-field>
 *    Use: @FindBy(id = "email")
 * 
 * 4. Angular buttons:
 *    <button mat-raised-button color="primary">Login</button>
 *    Use: @FindBy(css = "button[color='primary']")
 *    Or:  @FindBy(xpath = "//button[text()='Login']")
 * 
 * =============================================================================
 * HOW TO UPDATE:
 * =============================================================================
 * 
 * 1. Run your Angular app: ng serve
 * 2. Open http://localhost:4200 in Chrome
 * 3. Navigate to Login page
 * 4. Right-click → Inspect each element
 * 5. Copy the id/name/class values
 * 6. Update LoginPage.java with actual values
 * 7. Repeat for Register page and RegisterPage.java
 * 8. Run tests: mvn test
 * 9. Fix any element not found errors by double-checking locators
 * 
 * =============================================================================
 */
public class ElementLocatorGuide {
    // This is a reference file only - do not instantiate
    private ElementLocatorGuide() {}
}
