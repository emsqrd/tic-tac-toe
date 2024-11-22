import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
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
import {
  setCurrentPlayer,
  switchPlayer,
  updatePlayerWins,
} from '../player/player.actions';
import { updateDraws } from '../game/game.actions';
import {
  selectGameBoard,
  selectRoundStartingPlayerIndex,
} from './round.selectors';
import { selectCurrentPlayer } from '../player/player.selectors';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
import { selectGameDifficulty } from '../game/game.selectors';

export function mockDelay<T>(
  duration: unknown
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => source;
}

describe('RoundEffects', () => {
  let actions$: Observable<any>;
  let effects: RoundEffects;
  let gameService: GameService;
  let mockStore: MockStore;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;
  let currentPlayerMock: Player;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();

    gameService = new GameService();
    jest.spyOn(gameService, 'calculateWinner');
    jest.spyOn(gameService, 'determineOutcome');
    jest.spyOn(gameService, 'getRandomEmptySquare');
    jest.spyOn(gameService, 'makeMediumCpuMove');
    jest.spyOn(gameService, 'makeHardCpuMove');

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

    // Add delay mock
    jest.spyOn(effects as any, 'applyDelay').mockImplementation(mockDelay);
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should apply delay operator with specified duration', () => {
    // Create a test observable
    const source$ = of('test');
    const delayDuration = 1000;

    // Spy on the actual delay operator
    const delaySpy = jest.spyOn(effects as any, 'applyDelay');

    // Use the delay operator
    source$.pipe(effects['applyDelay'](delayDuration)).subscribe();

    // Verify the delay was called with correct duration
    expect(delaySpy).toHaveBeenCalledWith(delayDuration);
  });

  it('should dispatch makeHumanMove action', (done) => {
    const action = RoundActions.makeHumanMove({ position: 0 });

    actions$ = of(action);

    const expectedActions = [
      RoundActions.setProcessingMove({ processingMove: true }),
      RoundActions.setBoardPosition({
        position: 0,
        piece: currentPlayerMock.piece,
      }),
    ];

    effects.makeHumanMove$.pipe(toArray()).subscribe((result) => {
      expect(result).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch the makeCpuMove action for easy difficulty', (done) => {
    const cpuPlayer = {
      ...currentPlayerMock,
      isCpu: true,
    };
    const mockGameBoard = Array(9).fill({ gamePiece: '', isWinner: false });
    const position = 0;

    // Override selectors used in the effect
    mockStore.overrideSelector(selectCurrentPlayer, cpuPlayer);
    mockStore.overrideSelector(selectGameBoard, mockGameBoard);
    mockStore.overrideSelector(selectGameDifficulty, GameDifficultyEnum.Easy);
    (gameService.getRandomEmptySquare as jest.Mock).mockReturnValue(position);

    const action = RoundActions.makeCPUMove();

    actions$ = of(action);

    const expectedActions = [
      RoundActions.setProcessingMove({ processingMove: true }),
      RoundActions.setBoardPosition({ position, piece: cpuPlayer.piece }),
    ];

    effects.makeCpuMove$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      expect(effects['applyDelay']).toHaveBeenCalledWith(500);
      expect(gameService.getRandomEmptySquare).toHaveBeenCalledWith(
        mockGameBoard
      );
      done();
    });
  });

  it('should dispatch the makeCpuMove action for medium difficulty', (done) => {
    const cpuPlayer = {
      ...currentPlayerMock,
      isCpu: true,
    };
    const mockGameBoard = Array(9).fill({ gamePiece: '', isWinner: false });
    const position = 0;

    // Override selectors used in the effect
    mockStore.overrideSelector(selectCurrentPlayer, cpuPlayer);
    mockStore.overrideSelector(selectGameBoard, mockGameBoard);
    mockStore.overrideSelector(selectGameDifficulty, GameDifficultyEnum.Medium);
    (gameService.makeMediumCpuMove as jest.Mock).mockReturnValue(position);

    const action = RoundActions.makeCPUMove();

    actions$ = of(action);

    const expectedActions = [
      RoundActions.setProcessingMove({ processingMove: true }),
      RoundActions.setBoardPosition({ position, piece: cpuPlayer.piece }),
    ];

    effects.makeCpuMove$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      expect(effects['applyDelay']).toHaveBeenCalledWith(500);
      expect(gameService.makeMediumCpuMove).toHaveBeenCalledWith(mockGameBoard);
      done();
    });
  });

  it('should dispatch the makeCpuMove action for hard difficulty', (done) => {
    const cpuPlayer = {
      ...currentPlayerMock,
      isCpu: true,
    };
    const mockGameBoard = Array(9).fill({ gamePiece: '', isWinner: false });
    const position = 0;

    // Override selectors used in the effect
    mockStore.overrideSelector(selectCurrentPlayer, cpuPlayer);
    mockStore.overrideSelector(selectGameBoard, mockGameBoard);
    mockStore.overrideSelector(selectGameDifficulty, GameDifficultyEnum.Hard);
    (gameService.makeHardCpuMove as jest.Mock).mockReturnValue(position);

    const action = RoundActions.makeCPUMove();

    actions$ = of(action);

    const expectedActions = [
      RoundActions.setProcessingMove({ processingMove: true }),
      RoundActions.setBoardPosition({ position, piece: cpuPlayer.piece }),
    ];

    effects.makeCpuMove$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      expect(effects['applyDelay']).toHaveBeenCalledWith(500);
      expect(gameService.makeHardCpuMove).toHaveBeenCalledWith(mockGameBoard);
      done();
    });
  });

  it('should dispatch endRound action with Win outcome if there is a winner', (done) => {
    const action = RoundActions.setBoardPosition({
      position: 0,
      piece: currentPlayerMock.piece,
    });

    actions$ = of(action);

    const winningPositions = [0, 1, 2];
    const outcome = OutcomeEnum.Win;

    (gameService.calculateWinner as jest.Mock).mockReturnValue(
      winningPositions
    );
    (gameService.determineOutcome as jest.Mock).mockReturnValue(outcome);

    const expectedActions = [
      RoundActions.endRound({
        outcome: outcome,
        winningPositions: winningPositions,
      }),
      RoundActions.setProcessingMove({ processingMove: false }),
    ];

    effects.setBoardPosition$.pipe(toArray()).subscribe((results) => {
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

    const action = RoundActions.setBoardPosition({
      position: 9,
      piece: currentPlayerMock.piece,
    });

    const outcome = OutcomeEnum.Draw;
    (gameService.calculateWinner as jest.Mock).mockReturnValue(null);
    (gameService.determineOutcome as jest.Mock).mockReturnValue(outcome);

    actions$ = of(action);

    const expectedActions = [
      RoundActions.endRound({
        outcome: outcome,
        winningPositions: null,
      }),
      RoundActions.setProcessingMove({ processingMove: false }),
    ];

    effects.setBoardPosition$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch switchPlayer action if there is no winner and the board is not full', (done) => {
    const action = RoundActions.setBoardPosition({
      position: 0,
      piece: currentPlayerMock.piece,
    });

    (gameService.calculateWinner as jest.Mock).mockReturnValue(null);
    (gameService.determineOutcome as jest.Mock).mockReturnValue(
      OutcomeEnum.None
    );

    actions$ = of(action);

    const expectedActions = [
      switchPlayer(),
      RoundActions.setProcessingMove({ processingMove: false }),
    ];

    effects.setBoardPosition$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch updatePlayerWins and switchRoundStartingPlayerIndex actions if the round ended with a Win outcome', (done) => {
    const action = RoundActions.endRound({
      outcome: OutcomeEnum.Win,
      winningPositions: [0, 1, 2],
    });

    actions$ = of(action);

    const expectedActions = [
      updatePlayerWins(),
      RoundActions.switchRoundStartingPlayerIndex(),
    ];

    effects.endRound$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch updateDraws and switchRoundStartingPlayerIndex actions if the round ended with a Draw outcome', (done) => {
    const action = RoundActions.endRound({
      outcome: OutcomeEnum.Draw,
      winningPositions: null,
    });

    actions$ = of(action);

    const expectedActions = [
      updateDraws(),
      RoundActions.switchRoundStartingPlayerIndex(),
    ];

    effects.endRound$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      done();
    });
  });

  it('should dispatch switchRoundStartingPlayerIndex action if the round ended without an outcome', (done) => {
    const action = RoundActions.endRound({
      outcome: OutcomeEnum.None,
      winningPositions: null,
    });
    actions$ = of(action);

    effects.endRound$.subscribe((result) => {
      expect(result).toEqual(RoundActions.switchRoundStartingPlayerIndex());
      done();
    });
  });

  it('should dispatch setCurrentPlayer when starting a new round', (done) => {
    const startingPlayerIndex = 1;

    mockStore.overrideSelector(
      selectRoundStartingPlayerIndex,
      startingPlayerIndex
    );

    const action = RoundActions.startRound();

    actions$ = of(action);

    effects.startRound$.subscribe((result) => {
      expect(result).toEqual(
        setCurrentPlayer({ currentPlayerIndex: startingPlayerIndex })
      );
      done();
    });
  });
});
