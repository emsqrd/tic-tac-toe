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
});
