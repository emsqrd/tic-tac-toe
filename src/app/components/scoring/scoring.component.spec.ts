import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringComponent } from './scoring.component';

describe('ScoringComponent', () => {
  let component: ScoringComponent;
  let fixture: ComponentFixture<ScoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoringComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should identify player 1 and their score when they are the current player', () => {
    const currentPlayer =
      fixture.debugElement.nativeElement.querySelector('#player1');
    const currentPlayerScore =
      fixture.debugElement.nativeElement.querySelector('#player1Score');

    component.player1IsCurrent = true;
    fixture.detectChanges();

    expect(currentPlayer).toHaveClass('select-result');
    expect(currentPlayerScore).toHaveClass('select-result');
  });

  it('should identify a draw and the number of draws', () => {
    const draw = fixture.debugElement.nativeElement.querySelector('#draw');
    const drawTotal = fixture.debugElement.nativeElement.querySelector('#draw');

    component.isDraw = true;
    fixture.detectChanges();

    expect(draw).toHaveClass('scoring-result');
    expect(drawTotal).toHaveClass('scoring-result');
  });

  it('should identify player 1 as a winner', () => {
    const winningPlayer =
      fixture.debugElement.nativeElement.querySelector('#player1');
    const winningPlayerScore =
      fixture.debugElement.nativeElement.querySelector('#player1Score');

    component.player1IsWinner = true;
    fixture.detectChanges();

    expect(winningPlayer).toHaveClass('scoring-result');
    expect(winningPlayerScore).toHaveClass('scoring-result');
  });
});
