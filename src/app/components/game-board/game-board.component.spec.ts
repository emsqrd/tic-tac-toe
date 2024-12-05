import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { take, combineLatest } from 'rxjs';

import { GameBoardComponent } from './game-board.component';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
import { Player } from '../../models/player';
import { GameState } from '../../store/game/game.reducer';
import { PlayerState } from '../../store/player/player.reducer';
import { RoundState } from '../../store/round/round.reducer';
import { RoundActions } from '../../store/round/round.actions';
import {
  selectDraws,
  selectGameDifficulty,
  selectGameMode,
} from '../../store/game/game.selectors';
import {
  selectCurrentPlayer,
  selectPlayers,
} from '../../store/player/player.selectors';
import {
  selectGameBoard,
  selectOutcome,
} from '../../store/round/round.selectors';
import {
  resetDraws,
  startGame,
  switchGameDifficulty,
  switchGameMode,
} from '../../store/game/game.actions';
import { resetPlayers } from '../../store/player/player.actions';
import { getInitialPlayerStateMock } from '../../store/mocks/player-mocks';
import { getInitialGameStateMock } from '../../store/mocks/game-mocks';
import { getInitialRoundStateMock } from '../../store/mocks/round-mocks';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;
  let currentPlayerMock: Player;

  beforeEach(async () => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();

    await TestBed.configureTestingModule({
      imports: [GameBoardComponent, SquareComponent, ScoringComponent],
      providers: [
        provideMockStore({
          initialState: {
            game: initialGameStateMock,
            player: initialPlayerStateMock,
            round: initialRoundStateMock,
          },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(store, 'dispatch');

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    store.overrideSelector(selectGameBoard, initialRoundStateMock.gameBoard);
    store.overrideSelector(selectOutcome, initialRoundStateMock.outcome);
    store.overrideSelector(selectCurrentPlayer, currentPlayerMock);
    store.overrideSelector(selectPlayers, initialPlayerStateMock.players);
    store.overrideSelector(selectDraws, initialGameStateMock.draws);

    store.setState({
      game: initialGameStateMock,
      player: initialPlayerStateMock,
      round: initialRoundStateMock,
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('creates component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('game moves', () => {
    test('dispatches processHumanMove when attempting valid move during active game', async () => {
      // Setup initial state with empty board and active game
      const emptyBoard = Array(9).fill({ gamePiece: '', isWinner: false });
      store.overrideSelector(selectOutcome, OutcomeEnum.None);
      store.overrideSelector(selectGameBoard, emptyBoard);
      store.overrideSelector(selectCurrentPlayer, currentPlayerMock);

      // Force store to emit new values
      store.refreshState();
      fixture.detectChanges();

      // Directly call attemptMove
      await component.attemptMove(0);

      // Verify the action was dispatched
      expect(dispatchSpy).toHaveBeenCalledWith(
        RoundActions.processHumanMove({
          position: 0,
          piece: currentPlayerMock.piece,
        })
      );
    });

    test('ignores clicks on occupied squares', () => {
      const position = 0;
      const occupiedBoard = Array(9).fill({ gamePiece: '', isWinner: false });
      occupiedBoard[position].gamePiece = currentPlayerMock.piece;

      store.overrideSelector(selectOutcome, OutcomeEnum.None);
      store.overrideSelector(selectGameBoard, occupiedBoard);
      store.refreshState();
      fixture.detectChanges();

      component.squareClick(position);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        RoundActions.processHumanMove({
          position,
          piece: currentPlayerMock.piece,
        })
      );
    });

    test('starts new round when clicking square after game ends', () => {
      store.overrideSelector(selectOutcome, OutcomeEnum.Win);
      store.refreshState();
      fixture.detectChanges();

      const square: DebugElement = fixture.debugElement.query(
        By.css('t3-square')
      );
      square.triggerEventHandler('click', null);

      expect(dispatchSpy).toHaveBeenCalledWith(
        startGame({ gameMode: initialGameStateMock.gameMode })
      );
    });
  });

  describe('game outcomes', () => {
    test('correctly identifies draw state', (done) => {
      store.overrideSelector(selectOutcome, OutcomeEnum.Draw);
      fixture.detectChanges();

      component.isDraw$.subscribe((isDraw) => {
        expect(isDraw).toBe(true);
        done();
      });
    });

    test('correctly identifies non-draw state', (done) => {
      store.overrideSelector(selectOutcome, OutcomeEnum.Win);
      fixture.detectChanges();

      component.isDraw$.subscribe((isDraw) => {
        expect(isDraw).toBe(false);
        done();
      });
    });

    test('detects winning state', (done) => {
      const winningBoard = Array(9).fill({ gamePiece: '', isWinner: false });
      winningBoard[0] = { gamePiece: 'X', isWinner: true };
      winningBoard[1] = { gamePiece: 'X', isWinner: true };
      winningBoard[2] = { gamePiece: 'X', isWinner: true };

      store.overrideSelector(selectGameBoard, winningBoard);
      fixture.detectChanges();

      component.hasWinner$.subscribe((hasWinner) => {
        expect(hasWinner).toBe(true);
        done();
      });
    });
  });

  describe('game mode', () => {
    test('switches mode and starts new game when mode button clicked', () => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      fixture.detectChanges();

      const modeButton: DebugElement = fixture.debugElement.query(
        By.css('#btnGameMode')
      );
      modeButton.triggerEventHandler('click', null);

      expect(dispatchSpy).toHaveBeenCalledWith(switchGameMode());
      expect(dispatchSpy).toHaveBeenCalledWith(
        startGame({ gameMode: initialGameStateMock.gameMode })
      );
    });

    test('displays Two Player text in correct mode', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      store.refreshState();
      fixture.detectChanges();

      component.gameModeButtonText$.pipe(take(1)).subscribe((text) => {
        expect(text).toBe(GameModeEnum.TwoPlayer.valueOf());
        done();
      });
    });

    test('displays Single Player text in correct mode', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      store.refreshState();
      fixture.detectChanges();

      component.gameModeButtonText$.pipe(take(1)).subscribe((text) => {
        expect(text).toBe(GameModeEnum.SinglePlayer.valueOf());
        done();
      });
    });
  });

  describe('game difficulty', () => {
    test('switches difficulty and starts new game when difficulty button clicked', () => {
      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      store.overrideSelector(selectGameDifficulty, GameDifficultyEnum.Easy);
      store.refreshState();
      fixture.detectChanges();

      const difficultyButton: DebugElement = fixture.debugElement.query(
        By.css('#btnGameDifficulty')
      );
      difficultyButton.triggerEventHandler('click', null);

      expect(dispatchSpy).toHaveBeenCalledWith(switchGameDifficulty());
      expect(dispatchSpy).toHaveBeenCalledWith(
        startGame({ gameMode: initialGameStateMock.gameMode })
      );
    });

    test('shows difficulty button in single player mode', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      fixture.detectChanges();

      component.showDifficultyButton$.subscribe((show) => {
        expect(show).toBe(true);
        done();
      });
    });

    test('hides difficulty button in two player mode', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      fixture.detectChanges();

      component.showDifficultyButton$.subscribe((show) => {
        expect(show).toBe(false);
        done();
      });
    });

    test('displays correct difficulty text', (done) => {
      store.overrideSelector(selectGameDifficulty, GameDifficultyEnum.Easy);
      fixture.detectChanges();

      component.gameDifficultyButtonText$.subscribe((text) => {
        expect(text).toBe(GameDifficultyEnum.Easy.valueOf());
        done();
      });
    });
  });

  describe('game reset and new game', () => {
    test('resets players and draw count on game reset', () => {
      component.resetGame();

      expect(dispatchSpy).toHaveBeenCalledWith(
        RoundActions.resetRoundStartingPlayerIndex()
      );
      expect(dispatchSpy).toHaveBeenCalledWith(resetPlayers());
      expect(dispatchSpy).toHaveBeenCalledWith(resetDraws());
    });

    test('resets game and starts new game when startNewGame called', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      store.refreshState();
      fixture.detectChanges();

      const resetSpy = jest.spyOn(component, 'resetGame');
      component.startNewGame().subscribe(() => {
        expect(resetSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalledWith(
          startGame({ gameMode: GameModeEnum.TwoPlayer })
        );
        done();
      });
    });
  });

  describe('ui elements', () => {
    test('does not show coming soon message', (done) => {
      component.showComingSoon$.subscribe((show) => {
        expect(show).toBe(false);
        done();
      });
    });
  });

  describe('winning line calculations', () => {
    test('calculates horizontal win line coordinates', (done) => {
      const horizontalWinBoard = Array(9).fill({
        gamePiece: '',
        isWinner: false,
      });
      horizontalWinBoard[0] = { gamePiece: 'X', isWinner: true };
      horizontalWinBoard[1] = { gamePiece: 'X', isWinner: true };
      horizontalWinBoard[2] = { gamePiece: 'X', isWinner: true };

      store.overrideSelector(selectGameBoard, horizontalWinBoard);
      store.refreshState();
      fixture.detectChanges();

      combineLatest([
        component.lineStart$.pipe(take(1)),
        component.lineEnd$.pipe(take(1)),
      ]).subscribe(([start, end]) => {
        expect(start).toEqual({ x: 0, y: 50 });
        expect(end).toEqual({ x: 300, y: 50 });
        done();
      });
    });

    test('calculates diagonal win pattern', (done) => {
      const diagonalWinBoard = Array(9).fill({
        gamePiece: '',
        isWinner: false,
      });
      diagonalWinBoard[0] = { gamePiece: 'X', isWinner: true };
      diagonalWinBoard[4] = { gamePiece: 'X', isWinner: true };
      diagonalWinBoard[8] = { gamePiece: 'X', isWinner: true };

      store.overrideSelector(selectGameBoard, diagonalWinBoard);
      fixture.detectChanges();

      component.winningPattern$.subscribe((pattern) => {
        expect(pattern).toBe('diagonal');
        done();
      });
    });
  });
});
