import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './components/ui/toaster.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('FrontEND');
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  ngOnInit() {
    // Initialize translation
    this.translate.addLangs(['en', 'hi']);
    this.translate.setDefaultLang('en');
    
    // Set language from service
    const currentLang = this.languageService.getCurrentLanguage();
    this.translate.use(currentLang);
  }
}
