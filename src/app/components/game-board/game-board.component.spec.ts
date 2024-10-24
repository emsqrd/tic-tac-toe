import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { GameBoardComponent } from './game-board.component';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import {
  selectDraws,
  selectGameBoard,
  selectOutcome,
} from '../../store/game/game.selectors';
import { attemptMove, startGame } from '../../store/game/game.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { OutcomeEnum } from '../../enums/outcome.enum';
import {
  selectCurrentPlayer,
  selectCurrentPlayerIndex,
  selectPlayers,
} from '../../store/player/player.selectors';
import { switchPlayer } from '../../store/player/player.actions';
import { GameState } from '../../store/game/game.reducer';
import { PlayerState } from '../../store/player/player.reducer';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const initialGameState: GameState = {
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    outcome: OutcomeEnum.None,
    draws: 0,
  };

  const initialPlayerState: PlayerState = {
    players: [
      {
        name: 'Player 1',
        piece: 'X',
        wins: 0,
      },
      {
        name: 'Player 2',
        piece: 'O',
        wins: 0,
      },
    ],
    currentPlayerIndex: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent, SquareComponent, ScoringComponent],
      providers: [
        provideMockStore({ initialState: initialGameState }),
        provideMockStore({ initialState: initialPlayerState }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    store.overrideSelector(selectGameBoard, initialGameState.gameBoard);
    store.overrideSelector(selectOutcome, initialGameState.outcome);
    store.overrideSelector(
      selectCurrentPlayer,
      initialPlayerState.players[initialPlayerState.currentPlayerIndex]
    );

    // selectors used by scoring component
    store.overrideSelector(selectPlayers, initialPlayerState.players);
    store.overrideSelector(selectDraws, initialGameState.draws);

    // Reset the state before each test
    store.setState({
      game: initialGameState,
      player: initialPlayerState,
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any resources or subscriptions
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch attemptMove action when a square is clicked and there is no outcome', () => {
    component.outcome = OutcomeEnum.None;
    const currentPlayerMock = { name: 'Player 1', piece: 'X', wins: 0 };

    const squareDebugElement: DebugElement = fixture.debugElement.query(
      By.css('t3-square')
    );
    squareDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(
      attemptMove({ position: 0, currentPlayer: currentPlayerMock })
    );
  });

  it('should dispatch startGame and swtichPlayer actions when a square is clicked and the outcome is not None', () => {
    component.outcome = OutcomeEnum.Win;

    const squareDebugElement: DebugElement = fixture.debugElement.query(
      By.css('t3-square')
    );
    squareDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(startGame());
    expect(dispatchSpy).toHaveBeenCalledWith(switchPlayer());
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
