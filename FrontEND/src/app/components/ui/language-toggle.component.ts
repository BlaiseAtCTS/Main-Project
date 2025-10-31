import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'ui-language-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg shadow-inner">
      <!-- English Button -->
      <button
        (click)="setLanguage('en')"
        [class.bg-white]="currentLanguage() === 'en'"
        [class.shadow-md]="currentLanguage() === 'en'"
        [class.text-primary-700]="currentLanguage() === 'en'"
        [class.font-semibold]="currentLanguage() === 'en'"
        [class.text-gray-500]="currentLanguage() !== 'en'"
        class="px-4 py-2 rounded-md transition-all duration-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        type="button"
        [attr.aria-pressed]="currentLanguage() === 'en'"
      >
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span class="text-sm font-medium">EN</span>
        </div>
      </button>

      <!-- Hindi Button -->
      <button
        (click)="setLanguage('hi')"
        [class.bg-white]="currentLanguage() === 'hi'"
        [class.shadow-md]="currentLanguage() === 'hi'"
        [class.text-primary-700]="currentLanguage() === 'hi'"
        [class.font-semibold]="currentLanguage() === 'hi'"
        [class.text-gray-500]="currentLanguage() !== 'hi'"
        class="px-4 py-2 rounded-md transition-all duration-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        type="button"
        [attr.aria-pressed]="currentLanguage() === 'hi'"
      >
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span class="text-sm font-medium">हिं</span>
        </div>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class LanguageToggleComponent {
  private languageService = inject(LanguageService);

  currentLanguage = computed(() => this.languageService.currentLanguage());

  setLanguage(lang: 'en' | 'hi') {
    this.languageService.setLanguage(lang);
  }
}
