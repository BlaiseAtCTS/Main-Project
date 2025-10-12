import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { provideZoneChangeDetection } from '@angular/core';

// 👇 this import ensures Zone.js is loaded globally
import 'zone.js';  

bootstrapApplication(AppComponent, {
  providers: [
    // 👇 enables Angular's zone-based change detection
    provideZoneChangeDetection({ eventCoalescing: true }),
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
