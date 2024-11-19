import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { GameBoardComponent } from './game-board.component';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import {
  selectDraws,
  selectGameDifficulty,
  selectGameMode,
} from '../../store/game/game.selectors';
import {
  resetDraws,
  startGame,
  switchGameDifficulty,
  switchGameMode,
} from '../../store/game/game.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { OutcomeEnum } from '../../enums/outcome.enum';
import {
  selectCurrentPlayer,
  selectPlayers,
} from '../../store/player/player.selectors';
import { resetPlayers, switchPlayer } from '../../store/player/player.actions';
import { GameState } from '../../store/game/game.reducer';
import { PlayerState } from '../../store/player/player.reducer';
import { getInitialPlayerStateMock } from '../../store/mocks/player-mocks';
import { getInitialGameStateMock } from '../../store/mocks/game-mocks';
import {
  selectGameBoard,
  selectOutcome,
  selectRoundStartingPlayerIndex,
} from '../../store/round/round.selectors';
import { RoundState } from '../../store/round/round.reducer';
import { getInitialRoundStateMock } from '../../store/mocks/round-mocks';
import { RoundActions } from '../../store/round/round.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { Player } from '../../models/player';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
import { take, combineLatest } from 'rxjs';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;
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
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    store.overrideSelector(selectGameBoard, initialRoundStateMock.gameBoard);
    store.overrideSelector(selectOutcome, initialRoundStateMock.outcome);
    store.overrideSelector(selectCurrentPlayer, currentPlayerMock);

    // selectors used by scoring component
    store.overrideSelector(selectPlayers, initialPlayerStateMock.players);
    store.overrideSelector(selectDraws, initialGameStateMock.draws);

    // Reset the state before each test
    store.setState({
      game: initialGameStateMock,
      player: initialPlayerStateMock,
      round: initialRoundStateMock,
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any resources or subscriptions
    store.resetSelectors();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Game Moves', () => {
    it('should dispatch makeHumanMove action when a square is clicked and there is no outcome', () => {
      store.overrideSelector(selectOutcome, OutcomeEnum.None);
      store.refreshState();
      fixture.detectChanges();

      const squareDebugElement: DebugElement = fixture.debugElement.query(
        By.css('t3-square')
      );

      squareDebugElement.triggerEventHandler('click', null);

      expect(dispatchSpy).toHaveBeenCalledWith(
        RoundActions.makeHumanMove({ position: 0 })
      );
    });

    it('should not dispatch makeHumanMove action when a square is clicked that is already taken', () => {
      const position = 0;
      const squareTakenMock = Array(9).fill({ gamePiece: '', isWinner: false });
      squareTakenMock[position].gamePiece = currentPlayerMock.piece;

      store.overrideSelector(selectOutcome, OutcomeEnum.None);
      store.overrideSelector(selectGameBoard, squareTakenMock);
      store.refreshState();
      fixture.detectChanges();

      component.squareClick(position);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        RoundActions.makeHumanMove({ position: position })
      );
    });

    it('should dispatch startGame and switchPlayer actions when a square is clicked and the outcome is not None', () => {
      store.overrideSelector(selectOutcome, OutcomeEnum.Win);
      store.refreshState();
      fixture.detectChanges();

      const squareDebugElement: DebugElement = fixture.debugElement.query(
        By.css('t3-square')
      );
      squareDebugElement.triggerEventHandler('click', null);

      expect(dispatchSpy).toHaveBeenCalledWith(
        startGame({ gameMode: initialGameStateMock.gameMode })
      );
    });
  });

  describe('Game Outcome', () => {
    it('should return true when the outcome is a draw', (done) => {
      store.overrideSelector(selectOutcome, OutcomeEnum.Draw);
      fixture.detectChanges();

      component.isDraw$.subscribe((isDraw) => {
        expect(isDraw).toBeTrue();
        done();
      });
    });

    it('should return false when the outcome is not a draw', (done) => {
      store.overrideSelector(selectOutcome, OutcomeEnum.Win);
      fixture.detectChanges();

      component.isDraw$.subscribe((isDraw) => {
        expect(isDraw).toBeFalse();
        done();
      });
    });

    it('should detect a winner when there are winning squares', (done) => {
      const boardWithWinner = Array(9).fill({ gamePiece: '', isWinner: false });
      boardWithWinner[0] = { gamePiece: 'X', isWinner: true };
      boardWithWinner[1] = { gamePiece: 'X', isWinner: true };
      boardWithWinner[2] = { gamePiece: 'X', isWinner: true };

      store.overrideSelector(selectGameBoard, boardWithWinner);
      fixture.detectChanges();

      component.hasWinner$.subscribe((hasWinner) => {
        expect(hasWinner).toBeTrue();
        done();
      });
    });
  });

  describe('Game Mode', () => {
    it('should switch the game mode and start a new game when game mode button is clicked', () => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      fixture.detectChanges();

      const gameModeButtonDebugElement: DebugElement =
        fixture.debugElement.query(By.css('#btnGameMode'));
      gameModeButtonDebugElement.triggerEventHandler('click', null);

      expect(dispatchSpy).toHaveBeenCalledWith(switchGameMode());
      expect(dispatchSpy).toHaveBeenCalledWith(
        startGame({ gameMode: initialGameStateMock.gameMode })
      );
    });

    it('should display Two Player text when game mode is Two Player', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      store.refreshState();
      fixture.detectChanges();

      component.gameModeButtonText$.pipe(take(1)).subscribe((text) => {
        expect(text).toBe(GameModeEnum.TwoPlayer.valueOf());
        done();
      });
    });

    it('should display Single Player text when game mode is Single Player', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      store.refreshState();
      fixture.detectChanges();

      component.gameModeButtonText$.pipe(take(1)).subscribe((text) => {
        expect(text).toBe(GameModeEnum.SinglePlayer.valueOf());
        done();
      });
    });
  });

  describe('Game Difficulty', () => {
    it('should switch the game difficulty and start a new game when game difficulty button is clicked', () => {
      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      store.overrideSelector(selectGameDifficulty, GameDifficultyEnum.Easy);
      store.refreshState();
      fixture.detectChanges();

      const gameDifficultyButtonDebugElement: DebugElement =
        fixture.debugElement.query(By.css('#btnGameDifficulty'));
      gameDifficultyButtonDebugElement.triggerEventHandler('click', null);

      expect(dispatchSpy).toHaveBeenCalledWith(switchGameDifficulty());
      expect(dispatchSpy).toHaveBeenCalledWith(
        startGame({ gameMode: initialGameStateMock.gameMode })
      );
    });

    it('should display the switch difficulty button when the game mode is single player', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      fixture.detectChanges();

      component.showDifficultyButton$.subscribe((show) => {
        expect(show).toBeTrue();
        done();
      });
    });

    it('should not display the switch difficulty button when the game mode is two player', (done) => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      fixture.detectChanges();

      component.showDifficultyButton$.subscribe((show) => {
        expect(show).toBeFalse();
        done();
      });
    });

    it('should display the correct game difficulty button text', (done) => {
      store.overrideSelector(selectGameDifficulty, GameDifficultyEnum.Easy);
      fixture.detectChanges();

      component.gameDifficultyButtonText$.subscribe((text) => {
        expect(text).toBe(GameDifficultyEnum.Easy.valueOf());
        done();
      });
    });
  });

  describe('Game Reset and New Game', () => {
    it('should reset players and draw count when resetGame is called', () => {
      component.resetGame();

      expect(dispatchSpy).toHaveBeenCalledWith(resetPlayers());
      expect(dispatchSpy).toHaveBeenCalledWith(resetDraws());
    });

    it('should reset the game and start a new game when startNewGame is called', () => {
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      store.refreshState();
      fixture.detectChanges();

      spyOn(component, 'resetGame').and.callThrough();
      component.startNewGame();

      expect(component.resetGame).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        startGame({ gameMode: GameModeEnum.TwoPlayer })
      );
    });
  });

  describe('UI Elements', () => {
    it('should not show the coming soon message', (done) => {
      component.showComingSoon$.subscribe((show) => {
        expect(show).toBeFalse();
        done();
      });
    });
  });

  describe('Winning Line Calculations', () => {
    it('should calculate correct line coordinates for horizontal win', (done) => {
      const boardWithHorizontalWin = Array(9).fill({
        gamePiece: '',
        isWinner: false,
      });
      boardWithHorizontalWin[0] = { gamePiece: 'X', isWinner: true };
      boardWithHorizontalWin[1] = { gamePiece: 'X', isWinner: true };
      boardWithHorizontalWin[2] = { gamePiece: 'X', isWinner: true };

      store.overrideSelector(selectGameBoard, boardWithHorizontalWin);
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

    it('should calculate winning pattern correctly', (done) => {
      const boardWithDiagonalWin = Array(9).fill({
        gamePiece: '',
        isWinner: false,
      });
      boardWithDiagonalWin[0] = { gamePiece: 'X', isWinner: true };
      boardWithDiagonalWin[4] = { gamePiece: 'X', isWinner: true };
      boardWithDiagonalWin[8] = { gamePiece: 'X', isWinner: true };

      store.overrideSelector(selectGameBoard, boardWithDiagonalWin);
      fixture.detectChanges();

      component.winningPattern$.subscribe((pattern) => {
        expect(pattern).toBe('diagonal');
        done();
      });
    });
  });
});
