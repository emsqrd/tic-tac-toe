import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 't3-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private themeService: ThemeService) {}
  readonly isDarkMode$ = this.themeService.isDarkMode$.pipe(
    map((isDarkMode) => isDarkMode)
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
