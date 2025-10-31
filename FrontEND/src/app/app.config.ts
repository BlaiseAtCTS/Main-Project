import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { Observable, of } from 'rxjs';

// Import translation files directly
import enTranslations from '../assets/i18n/en.json';
import hiTranslations from '../assets/i18n/hi.json';

// Custom translation loader
export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    switch (lang) {
      case 'en':
        return of(enTranslations);
      case 'hi':
        return of(hiTranslations);
      default:
        return of(enTranslations);
    }
  }
}

// Configure TanStack Query with global settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
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
    provideAngularQuery(queryClient),
    {
      provide: TranslateLoader,
      useClass: CustomTranslateLoader
    },
    ...TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader
      }
    }).providers || []
  ]
};
