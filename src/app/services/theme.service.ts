import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private isDarkMode = new BehaviorSubject<boolean>(this.getStoredTheme());
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    this.applyTheme(this.isDarkMode.value);
  }

  private getStoredTheme(): boolean {
    const storedTheme = localStorage.getItem(this.THEME_KEY);
    return storedTheme ? JSON.parse(storedTheme) : false;
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.classList.toggle('dark-mode', isDark);

    // Remove no-transition class after theme is applied
    document.documentElement.classList.remove('no-transition');
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkMode.value;
    localStorage.setItem(this.THEME_KEY, JSON.stringify(newTheme));
    this.isDarkMode.next(newTheme);
    this.applyTheme(newTheme);
  }
}
