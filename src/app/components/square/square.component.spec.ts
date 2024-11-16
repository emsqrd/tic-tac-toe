import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareComponent } from './square.component';

describe('SquareComponent', () => {
  let component: SquareComponent;
  let fixture: ComponentFixture<SquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquareComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the game piece when a move is made', () => {
    const gamePieceDiv =
      fixture.debugElement.nativeElement.querySelector('.square');

    component.gamePiece = 'X';

    fixture.detectChanges();

    expect(gamePieceDiv).toHaveClass('x');
  });

  it('should apply the win css class when the square is a winning square', () => {
    const squareContainerDiv =
      fixture.debugElement.nativeElement.querySelector('#squareContainer');

    component.isWinner = true;

    fixture.detectChanges();

    expect(squareContainerDiv).toHaveClass('win');
  });
});
