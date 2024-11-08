import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { delay } from 'rxjs/operators';
import { Observable, of, toArray } from 'rxjs';
import { RoundEffects } from './round.effects';
import { GameService } from '../../services/game.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Player } from '../../models/player';
import { GameState } from '../game/game.reducer';
import { PlayerState } from '../player/player.reducer';
import { RoundState } from './round.reducer';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { getInitialRoundStateMock } from '../mocks/round-mocks';
import { RoundActions } from './round.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { switchPlayer, updatePlayerWins } from '../player/player.actions';
import { updateDraws } from '../game/game.actions';
import { selectGameBoard } from './round.selectors';
import { selectCurrentPlayer } from '../player/player.selectors';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

export function mockDelay<T>(
  duration: number
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => source;
}

describe('RoundEffects', () => {
  let actions$: Observable<any>;
  let effects: RoundEffects;
  let gameService: jasmine.SpyObj<GameService>;
  let mockStore: MockStore;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;
  let currentPlayerMock: Player;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();

    // todo: rename GameService to RoundService
    gameService = jasmine.createSpyObj('GameService', ['calculateWinner']);

    TestBed.configureTestingModule({
      providers: [
        RoundEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            game: initialGameStateMock,
            round: initialRoundStateMock,
            player: initialPlayerStateMock,
          },
        }),
        { provide: GameService, useValue: gameService },
      ],
    });

    effects = TestBed.inject(RoundEffects);
    mockStore = TestBed.inject(MockStore);

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should dispatch makeMove action on attemptMove if the square is not taken', (done) => {
    const action = RoundActions.attemptMove({ position: 0 });

    actions$ = of(action);

    const expectedActions = [
      RoundActions.setProcessingMove({ processingMove: true }),
      RoundActions.makeMove({
        position: 0,
        currentPlayer: currentPlayerMock,
        gameDifficulty: GameDifficultyEnum.Easy,
      }),
    ];

    effects.attemptMove$.pipe(toArray()).subscribe((result) => {
      expect(result).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch no-op action on attemptMove if the square is taken', () => {
    const action = RoundActions.attemptMove({ position: 0 });

    actions$ = of(action);

    mockStore.overrideSelector(selectGameBoard, [
      { gamePiece: 'X', isWinner: false },
      ...Array(8).fill({ gamePiece: '', isWinner: false }),
    ]);

    effects.attemptMove$.subscribe((result) => {
      expect(result).toEqual({ type: 'NO_OP' });
    });
  });

  it('should dispatch the makeMove action with a delay if the current player is the CPU', (done) => {
    const cpuPlayer = {
      ...currentPlayerMock,
      isCpu: true,
    };

    const position = 0;

    const action = RoundActions.attemptMove({ position });

    // Test for delay with CPU player
    mockStore.overrideSelector(selectCurrentPlayer, cpuPlayer);
    actions$ = of(action);

    spyOn<any>(effects, 'applyDelay').and.callFake(mockDelay);

    effects.attemptMove$.subscribe((result) => {
      if (result.type === RoundActions.makeMove.type) {
        expect(effects['applyDelay']).toHaveBeenCalledWith(500);
        expect(result).toEqual(
          RoundActions.makeMove({
            position: 0,
            currentPlayer: cpuPlayer,
            gameDifficulty: GameDifficultyEnum.Easy,
          })
        );
        done();
      }
    });
  });

  it('should dispatch makeMove action without a delay when current player is human', (done) => {
    const humanPlayer = {
      ...currentPlayerMock,
      isCpu: false,
    };

    const position = 0;

    mockStore.overrideSelector(selectCurrentPlayer, humanPlayer);
    actions$ = of(RoundActions.attemptMove({ position }));

    spyOn<any>(effects, 'applyDelay').and.callFake(mockDelay); // Mock the applyDelay function

    effects.attemptMove$.subscribe((action) => {
      if (action.type === RoundActions.makeMove.type) {
        expect(effects['applyDelay']).toHaveBeenCalledWith(0); // Check if no delay is applied
        expect(action).toEqual(
          RoundActions.makeMove({
            position,
            currentPlayer: humanPlayer,
            gameDifficulty: GameDifficultyEnum.Easy,
          })
        );
        done();
      }
    });
  });

  it('should dispatch endRound action with Win outcome if there is a winner', (done) => {
    const action = RoundActions.makeMove({
      position: 0,
      currentPlayer: currentPlayerMock,
      gameDifficulty: GameDifficultyEnum.Easy,
    });

    actions$ = of(action);

    gameService.calculateWinner.and.returnValue([0, 1, 2]);

    const expectedActions = [
      RoundActions.endRound({
        outcome: OutcomeEnum.Win,
        winningPositions: [0, 1, 2],
      }),
      RoundActions.setProcessingMove({ processingMove: false }),
    ];

    effects.makeMove$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch endRound action with Draw outcome if the board is full and no winner', (done) => {
    const fullBoardMock = {
      ...initialRoundStateMock,
      gameBoard: Array(8).fill({ gamePiece: 'X', isWinner: false }),
    };

    mockStore.overrideSelector(selectGameBoard, fullBoardMock.gameBoard);

    const action = RoundActions.makeMove({
      position: 9,
      currentPlayer: currentPlayerMock,
      gameDifficulty: GameDifficultyEnum.Easy,
    });

    gameService.calculateWinner.and.returnValue(null);

    actions$ = of(action);

    const expectedActions = [
      RoundActions.endRound({
        outcome: OutcomeEnum.Draw,
        winningPositions: null,
      }),
      RoundActions.setProcessingMove({ processingMove: false }),
    ];

    effects.makeMove$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch switchPlayer action if there is no winner and the board is not full', (done) => {
    const action = RoundActions.makeMove({
      position: 0,
      currentPlayer: currentPlayerMock,
      gameDifficulty: GameDifficultyEnum.Easy,
    });

    actions$ = of(action);
    gameService.calculateWinner.and.returnValue(null);

    const expectedActions = [
      switchPlayer(),
      RoundActions.setProcessingMove({ processingMove: false }),
    ];

    effects.makeMove$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch updatePlayerWins action if the round ended with a Win outcome', (done) => {
    const action = RoundActions.endRound({
      outcome: OutcomeEnum.Win,
      winningPositions: [0, 1, 2],
    });

    actions$ = of(action);

    effects.endRound$.subscribe((result) => {
      expect(result).toEqual(updatePlayerWins());
      done();
    });
  });

  it('should dispatch updateDraws action if the round ended with a Draw outcome', (done) => {
    const action = RoundActions.endRound({
      outcome: OutcomeEnum.Draw,
      winningPositions: null,
    });
    actions$ = of(action);

    effects.endRound$.subscribe((result) => {
      expect(result).toEqual(updateDraws());
      done();
    });
  });

  it('should dispatch no-op action if the round ended without an outcome', (done) => {
    const action = RoundActions.endRound({
      outcome: OutcomeEnum.None,
      winningPositions: null,
    });
    actions$ = of(action);

    effects.endRound$.subscribe((result) => {
      expect(result).toEqual({ type: 'NO_OP' });
      done();
    });
  });
});
