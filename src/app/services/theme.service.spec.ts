import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
      },
      writable: true,
    });

    document.documentElement.classList.remove('dark-mode');
  });

  test('should initialize with default light theme when no stored theme', () => {
    service = new ThemeService();
    expect(
      document.documentElement.classList.contains('dark-mode')
    ).toBeFalsy();
  });

  test('should initialize with stored theme from localStorage', () => {
    localStorageMock['theme'] = 'true';
    service = new ThemeService();
    expect(
      document.documentElement.classList.contains('dark-mode')
    ).toBeTruthy();
  });

  test('should toggle theme and update localStorage', () => {
    service = new ThemeService();
    service.toggleTheme();

    expect(
      document.documentElement.classList.contains('dark-mode')
    ).toBeTruthy();
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'true');

    service.toggleTheme();
    expect(
      document.documentElement.classList.contains('dark-mode')
    ).toBeFalsy();
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'false');
  });

  test('should emit new theme value when toggled', () => {
    service = new ThemeService();
    const themeValues: boolean[] = [];

    service.isDarkMode$.subscribe((value) => themeValues.push(value));
    service.toggleTheme();

    expect(themeValues).toEqual([false, true]);
  });
});
