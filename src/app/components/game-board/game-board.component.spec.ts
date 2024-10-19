import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { GameBoardComponent } from './game-board.component';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import {
  selectCurrentPlayer,
  selectGameBoard,
  selectOutcome,
} from '../../store/game/game.selectors';
import { makeMove, startGame } from '../../store/game/game.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { OutcomeEnum } from '../../enums/outcome.enum';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const initialState = {
    game: {
      gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
      player1: {
        name: 'Player 1',
        piece: 'X',
        wins: 0,
      },
      player2: {
        name: 'Player 2',
        piece: 'O',
        wins: 0,
      },
      currentPlayer: {
        name: 'Player 1',
        piece: 'X',
        wins: 0,
      },
      outcome: OutcomeEnum.None,
      draws: 0,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent, SquareComponent, ScoringComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    component.gameOver = false;
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    store.overrideSelector(selectGameBoard, initialState.game.gameBoard);
    store.overrideSelector(
      selectCurrentPlayer,
      initialState.game.currentPlayer
    );
    store.overrideSelector(selectOutcome, initialState.game.outcome);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch startGame action on init', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(startGame());
  });

  it('should dispatch makeMove action when a square is clicked', () => {
    const squareDebugElement: DebugElement = fixture.debugElement.query(
      By.css('t3-square')
    );
    squareDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(makeMove({ position: 0 }));
  });

  it('should dispatch startGame action when a square is clicked and game is over', () => {
    component.gameOver = true;
    const squareDebugElement: DebugElement = fixture.debugElement.query(
      By.css('t3-square')
    );
    squareDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(startGame());
    expect(component.gameOver).toBeFalse();
  });

  it('should return true when the outcome is a draw', () => {
    component.outcome = OutcomeEnum.Draw;
    expect(component.isDraw).toBeTrue();
  });

  it('should return false when the outcome is not a draw', () => {
    component.outcome = OutcomeEnum.Win;
    expect(component.isDraw).toBeFalse();
  });
});
