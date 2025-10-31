import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex items-center gap-2">
      <!-- Language Toggle Button - PROMINENT DESIGN -->
      <button
        (click)="toggleLanguage()"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100 transition-all duration-200 shadow-md hover:shadow-lg"
        [title]="'Switch to ' + (currentLanguage() === 'en' ? 'हिंदी (Hindi)' : 'English')"
      >
        <!-- Globe/Language Icon -->
        <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <!-- Language Text -->
        <span class="text-sm font-bold text-primary-700">
          {{ currentLanguage() === 'en' ? 'हिं' : 'EN' }}
        </span>
        <!-- Arrow/Change Indicator -->
        <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
  private languageService = inject(LanguageService);

  currentLanguage = computed(() => this.languageService.currentLanguage());

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
