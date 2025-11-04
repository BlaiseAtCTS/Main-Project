# Angular Frontend Development Guide

## Overview

This guide covers the Angular frontend development for our Banking Application. The frontend is built using Angular 20 with Tailwind CSS for styling, providing a modern, responsive, and user-friendly interface.

## Technology Stack

- **Angular 20**: Latest version with standalone components
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming for handling async operations
- **Angular Router**: Client-side routing
- **Angular HTTP Client**: API communication

## Project Structure

```
bankingFrontend/
├── src/
│   ├── app/
│   │   ├── components/          # Feature components
│   │   │   ├── login/           # Login component
│   │   │   ├── register/        # Registration component
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── accounts/        # Account management
│   │   │   └── transactions/    # Transaction management
│   │   ├── models/              # TypeScript interfaces
│   │   │   ├── user.model.ts
│   │   │   ├── account.model.ts
│   │   │   └── transaction.model.ts
│   │   ├── services/            # API services
│   │   │   ├── auth.service.ts
│   │   │   ├── account.service.ts
│   │   │   └── transaction.service.ts
│   │   ├── app.routes.ts        # Routing configuration
│   │   ├── app.config.ts        # App configuration
│   │   └── app.ts              # Main app component
│   ├── styles.css              # Global styles with Tailwind
│   └── index.html              # Main HTML file
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies
```

## Key Features

### 1. Authentication System
- **Login Component**: User authentication with JWT tokens
- **Registration Component**: New user registration
- **Auth Service**: Token management and authentication state

### 2. Dashboard
- **Main Dashboard**: Central hub for banking operations
- **Navigation**: Easy access to all banking features
- **User-friendly Interface**: Clean, modern design

### 3. Account Management
- **Create Account**: Open new bank accounts
- **Deposit/Withdraw**: Money operations
- **Balance Inquiry**: Check account balances
- **Account Deletion**: Remove accounts (with warnings)

### 4. Transaction Management
- **Money Transfers**: Transfer between accounts
- **Transaction History**: View past transactions
- **Real-time Processing**: Immediate transaction processing

## Component Architecture

### Standalone Components
All components are standalone, meaning they don't require NgModules:

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Component logic
}
```

### Service Architecture
Services handle all API communications:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  
  login(credentials: UserLoginRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/user/login`, credentials);
  }
}
```

## Styling with Tailwind CSS

### Configuration
Our `tailwind.config.js` includes custom colors and themes:

```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          600: '#2563eb',
          // ... more shades
        }
      }
    }
  }
}
```

### Custom CSS Classes
We've defined reusable utility classes in `styles.css`:

```css
@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-lg border border-gray-100;
  }
}
```

## API Integration

### HTTP Client Setup
Configured in `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};
```

### Service Pattern
Each service follows a consistent pattern:

```typescript
export class AccountService {
  private apiUrl = 'http://localhost:8080';
  
  constructor(private http: HttpClient) {}
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  createAccount(account: AccountCreateRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/account/create`, account, {
      headers: this.getHeaders()
    });
  }
}
```

## Routing Configuration

### Route Setup
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: '**', redirectTo: '/login' }
];
```

### Navigation
Programmatic navigation using Angular Router:

```typescript
constructor(private router: Router) {}

navigateToAccounts(): void {
  this.router.navigate(['/accounts']);
}
```

## State Management

### Authentication State
Using RxJS BehaviorSubject for reactive state management:

```typescript
@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  login(credentials: UserLoginRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/user/login`, credentials)
      .pipe(
        tap(token => {
          localStorage.setItem('token', token);
          this.currentUserSubject.next(token);
        })
      );
  }
}
```

## Form Handling

### Template-Driven Forms
Using Angular FormsModule for form handling:

```html
<form (ngSubmit)="onSubmit()" #loginForm="ngForm">
  <input
    name="userName"
    type="text"
    required
    [(ngModel)]="loginData.userName"
    class="input-field"
    placeholder="Enter your username"
  >
  <button
    type="submit"
    [disabled]="!loginForm.form.valid || isLoading"
    class="btn-primary"
  >
    Sign in
  </button>
</form>
```

## Error Handling

### Service Error Handling
```typescript
this.authService.login(this.loginData).subscribe({
  next: (token) => {
    this.isLoading = false;
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    this.isLoading = false;
    this.errorMessage = error.error || 'Login failed. Please try again.';
  }
});
```

### User Feedback
Consistent error and success message display:

```html
<div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
  {{ errorMessage }}
</div>

<div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
  {{ successMessage }}
</div>
```

## Development Workflow

### 1. Setting Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### 2. Adding New Components

```bash
# Generate component (if using Angular CLI)
ng generate component components/new-feature

# Or create manually following the established pattern
```

### 3. Component Development Pattern

1. **Create TypeScript file** with component logic
2. **Create HTML template** with Tailwind styling
3. **Create CSS file** for component-specific styles
4. **Update routes** if needed
5. **Add service methods** for API calls
6. **Test functionality** in browser

## Best Practices

### 1. Component Design
- Keep components focused on single responsibility
- Use standalone components for better tree-shaking
- Implement proper error handling and loading states

### 2. Service Design
- Separate concerns (auth, accounts, transactions)
- Use consistent error handling patterns
- Implement proper TypeScript typing

### 3. Styling
- Use Tailwind utility classes for consistency
- Create reusable component classes
- Maintain responsive design principles

### 4. Security
- Store JWT tokens securely
- Implement proper authentication guards
- Validate all user inputs

## Testing

### Component Testing
```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Deployment

### Build Process
```bash
# Development build
npm run build

# Production build
npm run build --configuration production
```

### Environment Configuration
Create environment files for different deployment stages:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration allows frontend origin
   - Check API URL configuration

2. **Authentication Issues**
   - Verify JWT token format and expiration
   - Check localStorage for token persistence

3. **Routing Issues**
   - Ensure all routes are properly configured
   - Check for missing component imports

4. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check for missing utility classes

## Performance Optimization

### 1. Lazy Loading
Implement lazy loading for feature modules:

```typescript
const routes: Routes = [
  {
    path: 'accounts',
    loadComponent: () => import('./components/accounts/accounts.component').then(m => m.AccountsComponent)
  }
];
```

### 2. OnPush Change Detection
Use OnPush strategy for better performance:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent {
  // Component implementation
}
```

### 3. TrackBy Functions
Implement trackBy for ngFor loops:

```typescript
trackByAccount(index: number, account: Account): string {
  return account.accountNumber;
}
```

## Future Enhancements

### Potential Improvements
1. **State Management**: Implement NgRx for complex state management
2. **PWA Features**: Add offline capabilities and push notifications
3. **Internationalization**: Support multiple languages
4. **Advanced UI**: Add charts, graphs, and data visualization
5. **Testing**: Comprehensive unit and integration tests
6. **Accessibility**: Improve ARIA labels and keyboard navigation

This frontend provides a solid foundation for a modern banking application with excellent user experience and maintainable code architecture!

