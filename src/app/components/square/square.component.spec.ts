import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SquareComponent } from './square.component';

describe('SquareComponent', () => {
  let component: SquareComponent;
  let fixture: ComponentFixture<SquareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SquareComponent],
    });

    fixture = TestBed.createComponent(SquareComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    test('renders without errors', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('when displaying game pieces', () => {
    test('adds x class to square element when X piece is played', () => {
      component.gamePiece = 'X';
      fixture.detectChanges();

      const square = fixture.nativeElement.querySelector('.square');
      expect(square.classList.contains('x')).toBe(true);
    });

    test('adds o class to square element when O piece is played', () => {
      component.gamePiece = 'O';
      fixture.detectChanges();

      const square = fixture.nativeElement.querySelector('.square');
      expect(square.classList.contains('o')).toBe(true);
    });

    test('has no game piece classes when gamePiece is undefined', () => {
      component.gamePiece = undefined;
      fixture.detectChanges();

      const square = fixture.nativeElement.querySelector('.square');
      expect(square.className).toBe('square');
    });
  });

  describe('when showing winning state', () => {
    test('adds win class to container when square is part of winning combination', () => {
      component.isWinner = true;
      fixture.detectChanges();

      const squareContainer =
        fixture.nativeElement.querySelector('#squareContainer');
      expect(squareContainer.classList.contains('win')).toBe(true);
    });
  });

  describe('grid lines', () => {
    test('shows grid lines svg when displayGrideLines is true', () => {
      component.displayGridLines = true;
      fixture.detectChanges();

      const gridLines = fixture.nativeElement.querySelector('.grid-lines');
      expect(gridLines).toBeTruthy();
    });

    test('hides grid lines svg when displayGrideLines is false', () => {
      component.displayGrideLines = false;
      fixture.detectChanges();

      const gridLines = fixture.nativeElement.querySelector('.grid-lines');
      expect(gridLines).toBeFalsy();
    });
  });

  describe('computed properties', () => {
    describe('displayXPiece', () => {
      test('returns true when gamePiece is X', () => {
        component.gamePiece = 'X';
        expect(component.displayXPiece).toBe(true);
      });

      test('returns false when gamePiece is O', () => {
        component.gamePiece = 'O';
        expect(component.displayXPiece).toBe(false);
      });

      test('returns false when gamePiece is undefined', () => {
        component.gamePiece = undefined;
        expect(component.displayXPiece).toBe(false);
      });
    });

    describe('displayOPiece', () => {
      test('returns true when gamePiece is O', () => {
        component.gamePiece = 'O';
        expect(component.displayOPiece).toBe(true);
      });

      test('returns false when gamePiece is X', () => {
        component.gamePiece = 'X';
        expect(component.displayOPiece).toBe(false);
      });

      test('returns false when gamePiece is undefined', () => {
        component.gamePiece = undefined;
        expect(component.displayOPiece).toBe(false);
      });
    });
  });

  describe('default values', () => {
    test('has expected default values', () => {
      expect(component.isWinner).toBe(false);
      expect(component.winType).toBeUndefined();
      expect(component.gamePiece).toBeUndefined();
      expect(component.displayGrideLines).toBe(false);
    });
  });
});
