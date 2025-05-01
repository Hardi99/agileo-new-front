import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Theme } from '../../core/models/task.model';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heading.component.html',
  styles: ``
})
export class HeadingComponent {
    theme: Theme = 'light';

    ngOnInit() {
      const savedTheme = localStorage.getItem('theme') as Theme;
      this.theme = savedTheme ?? 'light';
      this.applyTheme();
    }

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
    }
  
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme);
    }
  
    isDark() {
      return this.theme === 'dark';
    }
  variant = input<string>(); // qui permet de gérer les varientes des titres h1 à h6
  label = input<string>(""); // qui permet de gérer le contenu du titre qui est par défaut une chaine vide
}