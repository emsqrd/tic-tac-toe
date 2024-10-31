import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, toArray } from 'rxjs';
import { GameEffects } from './game.effects';
import { GameService } from '../../services/game.service';
import {
  attemptMove,
  makeMove,
  endGame,
  startGame,
  startRound,
} from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import {
  setCpuPlayer,
  switchPlayer,
  updatePlayerWins,
} from '../player/player.actions';
import { GameState } from './game.reducer';
import { PlayerState } from '../player/player.reducer';
import { TestScheduler } from 'rxjs/testing';
import { Player } from '../../models/player';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { selectGameMode } from './game.selectors';

describe('GameEffects', () => {
  let actions$: Observable<any>;
  let effects: GameEffects;
  let gameService: jasmine.SpyObj<GameService>;
  let mockStore: MockStore;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let currentPlayerMock: Player;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    gameService = jasmine.createSpyObj('GameService', ['calculateWinner']);

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            game: initialGameStateMock,
            player: initialPlayerStateMock,
          },
        }),
        { provide: GameService, useValue: gameService },
      ],
    });

    effects = TestBed.inject(GameEffects);
    mockStore = TestBed.inject(MockStore);

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    // Reset the state before each test
    mockStore.setState({
      game: initialGameStateMock,
      player: initialPlayerStateMock,
    });
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should dispatch makeMove action on attemptMove if the square is not taken', (done) => {
    const action = attemptMove({
      position: 0,
      currentPlayer: currentPlayerMock,
    });
    actions$ = of(action);

    effects.attemptMove$.subscribe((result) => {
      expect(result).toEqual(
        makeMove({
          position: 0,
          currentPlayer: currentPlayerMock,
        })
      );
      done();
    });
  });

  it('should dispatch no-op action on attemptMove if the square is taken', () => {
    const action = attemptMove({
      position: 0,
      currentPlayer: currentPlayerMock,
    });

    actions$ = of(action);

    mockStore.setState({
      game: {
        ...initialGameStateMock,
        gameBoard: [
          { gamePiece: 'X', isWinner: false },
          ...Array(8).fill({ gamePiece: '', isWinner: false }),
        ],
      },
      player: initialPlayerStateMock,
    });

    effects.attemptMove$.subscribe((result) => {
      expect(result).toEqual({ type: 'NO_OP' });
    });
  });

  it('should dispatch endGame action with Win outcome if there is a winner', (done) => {
    const action = makeMove({
      position: 0,
      currentPlayer: currentPlayerMock,
    });
    actions$ = of(action);
    gameService.calculateWinner.and.returnValue([0, 1, 2]);

    effects.makeMove$.subscribe((result) => {
      expect(result).toEqual(
        endGame({ outcome: OutcomeEnum.Win, winningPositions: [0, 1, 2] })
      );
      done();
    });
  });

  // Keeping this as marble syntax as an example in case I want to use this later on
  it('should dispatch endGame action with Draw outcome if the board is full and no winner', fakeAsync(() => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    // simulate a full board without a winner
    const fullBoardMock = {
      ...initialGameStateMock,
      gameBoard: Array(8).fill({ gamePiece: 'X', isWinner: false }),
    };

    // set the mock state with the full board
    mockStore.setState({
      game: fullBoardMock,
      player: initialPlayerStateMock,
    });

    testScheduler.run(({ hot, cold, expectObservable }) => {
      const action = makeMove({
        position: 9,
        currentPlayer: currentPlayerMock,
      });

      actions$ = hot('-a', { a: action });

      gameService.calculateWinner.and.returnValue(null);

      expectObservable(effects.makeMove$).toBe('-b', {
        b: endGame({ outcome: OutcomeEnum.Draw, winningPositions: null }),
      });
    });

    flush();
  }));

  it('should dispatch switchPlayer action if there is no winner and the board is not full', (done) => {
    const action = makeMove({
      position: 0,
      currentPlayer: currentPlayerMock,
    });
    actions$ = of(action);
    gameService.calculateWinner.and.returnValue(null);

    effects.makeMove$.subscribe((result) => {
      expect(result).toEqual(switchPlayer());
      done();
    });
  });

  it('should dispatch updatePlayerWins action if the game ended with a Win outcome', (done) => {
    const action = endGame({
      outcome: OutcomeEnum.Win,
      winningPositions: [0, 1, 2],
    });
    actions$ = of(action);

    effects.endGame$.subscribe((result) => {
      expect(result).toEqual(updatePlayerWins());
      done();
    });
  });

  it('should dispatch no-op action if the game ended with a Draw outcome', (done) => {
    const action = endGame({
      outcome: OutcomeEnum.Draw,
      winningPositions: null,
    });
    actions$ = of(action);

    effects.endGame$.subscribe((result) => {
      expect(result).toEqual({ type: 'NO_OP' });
      done();
    });
  });

  it('should dispatch only startRound action if starting a new game not in single player game mode', (done) => {
    const action = startGame({ gameMode: GameModeEnum.TwoPlayer });

    actions$ = of(action);

    effects.startGame$.subscribe((result) => {
      expect(result).toEqual(startRound());
      done();
    });
  });

  it('should dispatch setCpuPlayer action if starting a new game in single player game mode', (done) => {
    const singlePlayerMode = GameModeEnum.SinglePlayer;

    const action = startGame({ gameMode: singlePlayerMode });

    mockStore.overrideSelector(selectGameMode, singlePlayerMode);

    actions$ = of(action);

    // Expect the effect to dispatch multiple actions
    effects.startGame$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual([setCpuPlayer({ gamePiece: 'O' }), startRound()]);
      done();
    });
  });
});
