import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ThemeService } from '../../services/theme.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockThemeService: Partial<ThemeService>;

  beforeEach(async () => {
    mockThemeService = {
      isDarkMode$: of(false),
      toggleTheme: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call themeService.toggleTheme when theme button is clicked', () => {
    const button = fixture.debugElement.nativeElement.querySelector('a');
    button.click();

    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });
});
