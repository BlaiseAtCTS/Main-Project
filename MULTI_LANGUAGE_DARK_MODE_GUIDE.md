# Multi-Language & Dark Mode Implementation Guide
## IndiaShield Bank - Hindi & English Support + Dark/Light Theme

## Date: October 31, 2025

---

## ✅ What Has Been Done

### 1. Services Created:
- ✅ `theme.service.ts` - Manages dark/light mode
- ✅ `language.service.ts` - Manages language switching
- ✅ Translation files created:
  - `assets/i18n/en.json` - English translations
  - `assets/i18n/hi.json` - Hindi translations (हिंदी)
- ✅ Installed `@ngx-translate/core` and `@ngx-translate/http-loader`

---

## 🎯 Implementation Steps Needed

### Step 1: Fix App Configuration

**File**: `app.config.ts`

Due to version compatibility, we need to use a custom approach. Replace the current imports with:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

// Configure TanStack Query with global settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAngularQuery(queryClient)
  ]
};
```

---

### Step 2: Update app.ts (Main Component)

**File**: `app.ts`

Add TranslateModule import and initialization:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './components/ui/toaster.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);

  ngOnInit() {
    // Initialize translation
    this.translate.addLangs(['en', 'hi']);
    this.translate.setDefaultLang('en');
    
    // Set language from service
    const currentLang = this.languageService.getCurrentLanguage();
    this.translate.use(currentLang);
  }
}
```

---

### Step 3: Add Dark Mode CSS Variables

**File**: `styles.css` (add at the beginning)

```css
/* Root CSS Variables for Theming */
:root {
  /* Light Mode Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border-color: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark Mode Colors */
.dark {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --bg-tertiary: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;
  --border-color: #4b5563;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
}

/* Apply dark mode to body */
.dark {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.dark .bg-white {
  background-color: var(--bg-primary) !important;
}

.dark .bg-gray-50 {
  background-color: var(--bg-secondary) !important;
}

.dark .bg-gray-100 {
  background-color: var(--bg-tertiary) !important;
}

.dark .text-gray-900 {
  color: var(--text-primary) !important;
}

.dark .text-gray-700 {
  color: var(--text-secondary) !important;
}

.dark .text-gray-600,
.dark .text-gray-500 {
  color: var(--text-tertiary) !important;
}

.dark .border-gray-200,
.dark .border-gray-300 {
  border-color: var(--border-color) !important;
}

.dark .shadow-sm {
  box-shadow: var(--shadow-sm) !important;
}

.dark .shadow-md {
  box-shadow: var(--shadow-md) !important;
}

.dark .shadow-lg {
  box-shadow: var(--shadow-lg) !important;
}
```

---

### Step 4: Create Theme & Language Toggle Component

**File**: Create `settings-menu.component.ts`

```typescript
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { ButtonComponent } from '../ui/button.component';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonComponent],
  template: `
    <div class="flex items-center gap-2">
      <!-- Language Toggle -->
      <button
        (click)="toggleLanguage()"
        class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        [title]="'Switch to ' + (currentLanguage() === 'en' ? 'हिंदी' : 'English')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span class="text-sm font-medium">{{ currentLanguage() === 'en' ? 'हिं' : 'EN' }}</span>
      </button>

      <!-- Theme Toggle -->
      <button
        (click)="toggleTheme()"
        class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        [title]="isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <!-- Sun Icon (Light Mode) -->
        <svg *ngIf="!isDark()" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Moon Icon (Dark Mode) -->
        <svg *ngIf="isDark()" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SettingsMenuComponent {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  isDark = computed(() => this.themeService.isDark());
  currentLanguage = computed(() => this.languageService.currentLanguage());

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
```

---

### Step 5: Update Navbar Component

**File**: `navbar.component.ts`

Add the SettingsMenuComponent to imports and inject the services:

```typescript
import { SettingsMenuComponent } from '../settings-menu/settings-menu.component';
import { TranslateModule } from '@ngx-translate/core';

// Add to imports array:
imports: [..., SettingsMenuComponent, TranslateModule]
```

**File**: `navbar.component.html`

Add settings menu before logout button:

```html
<!-- Add before logout button -->
<app-settings-menu></app-settings-menu>
```

---

### Step 6: Update Components to Use Translation

**Example for Dashboard Component**:

**File**: `dashboard.component.ts`
```typescript
import { TranslateModule } from '@ngx-translate/core';

// Add to imports:
imports: [...existing imports..., TranslateModule]
```

**File**: `dashboard.html`

Replace text with translation keys:

```html
<!-- Before -->
<h1 class="text-3xl font-bold mb-2">Welcome back, {{ username() }}! 👋</h1>

<!-- After -->
<h1 class="text-3xl font-bold mb-2">{{ 'DASHBOARD.WELCOME_BACK' | translate }}, {{ username() }}! 👋</h1>
```

---

## 📝 Translation Key Usage Examples

### Basic Usage:
```html
{{ 'NAV.DASHBOARD' | translate }}
{{ 'ACCOUNTS.TITLE' | translate }}
{{ 'TRANSACTIONS.TRANSFER_MONEY' | translate }}
```

### With Parameters:
```html
{{ 'MESSAGES.WELCOME' | translate:{ name: username } }}
```

### In TypeScript:
```typescript
constructor(private translate: TranslateService) {}

showMessage() {
  this.translate.get('MESSAGES.SUCCESS').subscribe((text: string) => {
    console.log(text);
  });
}
```

---

## 🎨 Components to Update

### Priority 1 (High Traffic):
1. ✅ **Navbar** - Add settings menu
2. **Login** - All text labels
3. **Register** - All text labels
4. **Dashboard** - Headings, labels, buttons
5. **Accounts** - All text
6. **Transactions** - All text

### Priority 2 (Common Actions):
7. **Transfer** - Form labels
8. **Deposit** - Form labels
9. **Withdraw** - Form labels
10. **Profile** - User info labels

### Priority 3 (Admin):
11. **Admin Dashboard**
12. **Admin Users**

---

## 🧪 Testing Checklist

### Language Switching:
- [ ] Click language toggle - UI switches to Hindi
- [ ] Click again - UI switches back to English
- [ ] Refresh page - Language persists
- [ ] Check all pages render correctly in both languages

### Dark Mode:
- [ ] Click theme toggle - UI switches to dark mode
- [ ] All components render correctly in dark mode
- [ ] Colors are readable and aesthetically pleasing
- [ ] Toggle again - switches back to light mode
- [ ] Refresh page - Theme persists

### Combined:
- [ ] Switch to Hindi + Dark mode
- [ ] Switch to English + Light mode
- [ ] All combinations work correctly

---

## 📦 File Structure

```
src/
├── app/
│   ├── services/
│   │   ├── theme.service.ts ✅
│   │   └── language.service.ts ✅
│   ├── components/
│   │   ├── settings-menu/
│   │   │   └── settings-menu.component.ts (to create)
│   │   └── navbar/
│   │       └── navbar.component.ts (to update)
│   └── app.config.ts (to fix)
├── assets/
│   └── i18n/
│       ├── en.json ✅
│       └── hi.json ✅
└── styles.css (to update)
```

---

## 🚀 Quick Start Commands

```bash
# Already installed:
npm install @ngx-translate/core @ngx-translate/http-loader

# To test:
cd FrontEND
ng serve
# or
npm start
```

---

## 💡 Additional Features (Optional)

### 1. More Languages:
Add more translation files:
- `assets/i18n/ta.json` (Tamil)
- `assets/i18n/te.json` (Telugu)
- `assets/i18n/bn.json` (Bengali)

### 2. RTL Support:
For future Arabic/Urdu support:
```typescript
if (lang === 'ar' || lang === 'ur') {
  document.dir = 'rtl';
} else {
  document.dir = 'ltr';
}
```

### 3. System Preference Detection:
Already implemented in ThemeService - detects system dark mode preference

### 4. Per-User Preferences:
Store preferences in backend:
```typescript
// Save to user profile
updateUserPreferences({
  theme: 'dark',
  language: 'hi'
});
```

---

## 🎯 Benefits

### User Experience:
- ✅ Accessible to Hindi-speaking users (50%+ of India)
- ✅ Comfortable viewing in any lighting condition
- ✅ Modern, professional interface
- ✅ Preferences remembered across sessions

### Technical:
- ✅ Easy to add more languages
- ✅ CSS variables make theming flexible
- ✅ Services make it reusable
- ✅ localStorage ensures persistence

### Business:
- ✅ Wider user base (Hindi speakers)
- ✅ Better accessibility compliance
- ✅ Modern UX standards
- ✅ Competitive advantage

---

## 📚 Resources

- **ngx-translate docs**: https://github.com/ngx-translate/core
- **Tailwind Dark Mode**: https://tailwindcss.com/docs/dark-mode
- **Angular i18n**: https://angular.io/guide/i18n

---

## ⚠️ Important Notes

1. **Translation Coverage**: All 180+ translation keys are ready in both languages
2. **Dark Mode Classes**: Uses Tailwind's `dark:` prefix for automatic theme switching
3. **Performance**: Translations are loaded once and cached
4. **SEO**: Consider using Angular Universal for server-side rendering of translated content
5. **Accessibility**: Ensure color contrast meets WCAG 2.1 AA standards in both themes

---

## 🎉 Summary

**Completed:**
- ✅ Theme service with dark/light mode
- ✅ Language service with English/Hindi
- ✅ Complete translation files (180+ keys)
- ✅ npm packages installed

**Next Steps:**
1. Create SettingsMenuComponent
2. Update Navbar to include settings menu
3. Add TranslateModule to each component
4. Replace hardcoded text with translation pipes
5. Add dark mode CSS variables
6. Test thoroughly

This will make your IndiaShield Bank truly bilingual and modern with dark mode support! 🚀
