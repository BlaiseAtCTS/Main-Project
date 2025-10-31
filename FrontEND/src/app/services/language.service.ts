import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'hi';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'indiashield-language';
  
  // Signal to track current language
  currentLanguage = signal<Language>(this.getInitialLanguage());

  constructor(private translate: TranslateService) {
    // Set up available languages
    this.translate.addLangs(['en', 'hi']);
    
    // Set initial language
    const initialLang = this.getInitialLanguage();
    this.translate.setDefaultLang('en');
    this.translate.use(initialLang);
  }

  private getInitialLanguage(): Language {
    // Check localStorage first
    const savedLang = localStorage.getItem(this.LANGUAGE_KEY);
    if (savedLang === 'en' || savedLang === 'hi') {
      return savedLang;
    }

    // Default to English
    return 'en';
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang);
    this.currentLanguage.set(lang);
    localStorage.setItem(this.LANGUAGE_KEY, lang);
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage() === 'en' ? 'hi' : 'en';
    this.setLanguage(newLang);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage();
  }

  getLanguageName(lang: Language): string {
    return lang === 'en' ? 'English' : 'हिंदी';
  }
}
