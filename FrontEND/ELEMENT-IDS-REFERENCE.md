# Frontend Element IDs - Test Automation Reference

## ✅ IDs Added to Frontend Components

This document lists all the IDs that have been added to your Angular frontend components to match the Selenium test automation framework.

---

## 🔐 Login Page (`login.component.html`)

### Input Fields
- **Username Input**: `id="username"`
  - Type: text
  - Used for: Email/username login field

- **Password Input**: `id="password"`
  - Type: password
  - Used for: Password login field

### Buttons
- **Sign In Button**: `id="sign-in-button"`
  - Type: submit button
  - Used for: Submitting login form

### Links
- **Register Link**: `id="register-link"`
  - Used for: Navigation to registration page
  - Text: "Sign Up"

---

## 📝 Register Page (`register.component.html`)

### Input Fields
- **First Name Input**: `id="firstName"`
  - Type: text
  - Used for: User's first name

- **Last Name Input**: `id="lastName"`
  - Type: text
  - Used for: User's last name

- **Username Input**: `id="username"`
  - Type: text
  - Used for: Desired username

- **Password Input**: `id="password"`
  - Type: password
  - Used for: User's password

- **Email Input**: `id="email"`
  - Type: email
  - Used for: User's email address

- **Phone Number Input**: `id="phone"`
  - Type: tel
  - Used for: User's phone number

### Buttons
- **Register Button**: `id="register-button"`
  - Type: submit button
  - Used for: Submitting registration form

### Links
- **Login Link**: `id="login-link"`
  - Used for: Navigation to login page
  - Text: "Sign In"

---

## 🧭 Navigation Bar (`navbar.html`)

### Buttons
- **Logout Button (Desktop)**: `id="logout-button"`
  - Class: `logout-btn`
  - Used for: Logging out (desktop view)

- **Logout Button (Mobile)**: `id="logout-button-mobile"`
  - Class: `logout-btn`
  - Used for: Logging out (mobile view)

---

## 📋 Test Automation Mapping

### Login Tests → Frontend IDs

| Test Element | Frontend ID | Component |
|-------------|-------------|-----------|
| Username Input | `username` | login.component.html |
| Password Input | `password` | login.component.html |
| Login Button | `sign-in-button` | login.component.html |
| Register Link | `register-link` | login.component.html |
| Logout Button | `logout-button` or `logout-btn` class | navbar.html |

### Register Tests → Frontend IDs

| Test Element | Frontend ID | Component |
|-------------|-------------|-----------|
| First Name Input | `firstName` | register.component.html |
| Last Name Input | `lastName` | register.component.html |
| Username Input | `username` | register.component.html |
| Email Input | `email` | register.component.html |
| Password Input | `password` | register.component.html |
| Phone Input | `phone` | register.component.html |
| Register Button | `register-button` | register.component.html |
| Login Link | `login-link` | register.component.html |

---

## 🔍 How to Find Elements in Tests

### Using Selenium (in Page Objects)

```java
// Login Page
@FindBy(id = "username")
private WebElement usernameInput;

@FindBy(id = "password")
private WebElement passwordInput;

@FindBy(id = "sign-in-button")
private WebElement loginButton;

// Register Page
@FindBy(id = "firstName")
private WebElement firstNameInput;

@FindBy(id = "email")
private WebElement emailInput;

@FindBy(id = "register-button")
private WebElement registerButton;

// Logout Button
@FindBy(css = "button.logout-btn")
private WebElement logoutButton;
```

---

## ✨ Additional Notes

### CSS Classes for Testing
Some elements also have CSS classes that can be used for selection:
- **Logout Button**: Has class `logout-btn` in addition to ID
- This provides flexibility in element selection

### Error Messages (To Be Implemented)
The tests also look for these CSS selectors:
- `.error-message` - For displaying error messages
- `.alert-error` - For alert-style errors
- `.success-message` - For success messages
- `.alert-success` - For alert-style success messages
- `.welcome-message` - For welcome messages after login

**Recommendation**: Add these classes to your toast/notification components for better test support.

---

## 🚀 Running Tests Now

With these IDs in place, you can now run your Cucumber tests:

```powershell
# Make sure frontend is running
cd FrontEND
ng serve

# In another terminal, run tests
cd banking
.\mvnw.cmd clean test
```

The tests will now be able to locate all form elements correctly!

---

## 📝 Future Additions

If you add more forms or pages that need testing, follow this pattern:

1. **Input Fields**: Use descriptive IDs like `fieldName` (e.g., `email`, `username`)
2. **Buttons**: Use descriptive IDs like `action-button` (e.g., `login-button`, `submit-button`)
3. **Links**: Use descriptive IDs like `destination-link` (e.g., `register-link`, `forgot-password-link`)
4. **Error/Success Messages**: Use standard CSS classes (`.error-message`, `.success-message`)

---

## ✅ Summary

All required IDs have been added to support the Cucumber BDD test framework. The frontend elements now match the selectors defined in your Page Object Model classes.

**Files Modified:**
- ✅ `login.component.html` - Added username, password, sign-in-button, register-link IDs
- ✅ `register.component.html` - Added firstName, lastName, username, email, password, phone, register-button, login-link IDs
- ✅ `navbar.html` - Added logout-button IDs and logout-btn class

**Ready for Testing!** 🎉
