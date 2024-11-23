import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, toArray, firstValueFrom, lastValueFrom } from 'rxjs';
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

const mockDelay = <T>(
  duration: unknown
): ((source: Observable<T>) => Observable<T>) => {
  return (source: Observable<T>) => source;
};

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

    // Use Jest spyOn syntax
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

    jest.spyOn(effects as any, 'applyDelay').mockImplementation(mockDelay);
  });

  afterEach(() => {
    mockStore.resetSelectors();
    jest.clearAllMocks();
  });

  describe('utility methods', () => {
    test('should apply delay operator with specified duration', async () => {
      const source$ = of('test');
      const delayDuration = 1000;
      const delaySpy = jest.spyOn(effects as any, 'applyDelay');

      await firstValueFrom(source$.pipe(effects['applyDelay'](delayDuration)));

      expect(delaySpy).toHaveBeenCalledWith(delayDuration);
    });
  });

  describe('makeHumanMove$', () => {
    test('emits expected actions for human move', async () => {
      const action = RoundActions.makeHumanMove({ position: 0 });
      actions$ = of(action);

      const expectedActions = [
        RoundActions.setProcessingMove({ processingMove: true }),
        RoundActions.setBoardPosition({
          position: 0,
          piece: currentPlayerMock.piece,
        }),
      ];

      const result = await lastValueFrom(
        effects.makeHumanMove$.pipe(toArray())
      );
      expect(result).toEqual(expectedActions);
    });
  });

  describe('makeCpuMove$', () => {
    interface CpuMoveTest {
      difficulty: GameDifficultyEnum;
      getMove: (service: GameService) => jest.Mock;
    }

    const cpuMoveTestCases: CpuMoveTest[] = [
      {
        difficulty: GameDifficultyEnum.Easy,
        getMove: (service) => service.getRandomEmptySquare as jest.Mock,
      },
      {
        difficulty: GameDifficultyEnum.Medium,
        getMove: (service) => service.makeMediumCpuMove as jest.Mock,
      },
      {
        difficulty: GameDifficultyEnum.Hard,
        getMove: (service) => service.makeHardCpuMove as jest.Mock,
      },
    ];

    test.each(cpuMoveTestCases)(
      'handles $difficulty difficulty CPU moves correctly',
      async ({ difficulty, getMove }) => {
        const cpuPlayer = { ...currentPlayerMock, isCpu: true };
        const mockGameBoard = Array(9).fill({ gamePiece: '', isWinner: false });
        const position = 0;

        mockStore.overrideSelector(selectCurrentPlayer, cpuPlayer);
        mockStore.overrideSelector(selectGameBoard, mockGameBoard);
        mockStore.overrideSelector(selectGameDifficulty, difficulty);
        getMove(gameService).mockReturnValue(position);

        actions$ = of(RoundActions.makeCPUMove());

        const expectedActions = [
          RoundActions.setProcessingMove({ processingMove: true }),
          RoundActions.setBoardPosition({ position, piece: cpuPlayer.piece }),
        ];

        const result = await lastValueFrom(
          effects.makeCpuMove$.pipe(toArray())
        );

        expect(result).toEqual(expectedActions);
        expect(effects['applyDelay']).toHaveBeenCalledWith(500);
        expect(getMove(gameService)).toHaveBeenCalledWith(mockGameBoard);
      }
    );
  });

  describe('setBoardPosition$', () => {
    test('dispatches endRound action with Win outcome if there is a winner', async () => {
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

      const result = await lastValueFrom(
        effects.setBoardPosition$.pipe(toArray())
      );
      expect(result).toEqual(expectedActions);
    });

    test('dispatches endRound action with Draw outcome if the board is full and no winner', async () => {
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

      const result = await lastValueFrom(
        effects.setBoardPosition$.pipe(toArray())
      );
      expect(result).toEqual(expectedActions);
    });

    test('dispatches switchPlayer action if there is no winner and the board is not full', async () => {
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

      const result = await lastValueFrom(
        effects.setBoardPosition$.pipe(toArray())
      );
      expect(result).toEqual(expectedActions);
    });
  });

  describe('endRound$', () => {
    test('dispatches updatePlayerWins and switchRoundStartingPlayerIndex actions if the round ended with a Win outcome', async () => {
      const action = RoundActions.endRound({
        outcome: OutcomeEnum.Win,
        winningPositions: [0, 1, 2],
      });

      actions$ = of(action);

      const expectedActions = [
        updatePlayerWins(),
        RoundActions.switchRoundStartingPlayerIndex(),
      ];

      const result = await lastValueFrom(effects.endRound$.pipe(toArray()));
      expect(result).toEqual(expectedActions);
    });

    test('dispatches updateDraws and switchRoundStartingPlayerIndex actions if the round ended with a Draw outcome', async () => {
      const action = RoundActions.endRound({
        outcome: OutcomeEnum.Draw,
        winningPositions: null,
      });

      actions$ = of(action);

      const expectedActions = [
        updateDraws(),
        RoundActions.switchRoundStartingPlayerIndex(),
      ];

      const result = await lastValueFrom(effects.endRound$.pipe(toArray()));
      expect(result).toEqual(expectedActions);
    });

    test('dispatches switchRoundStartingPlayerIndex action if the round ended without an outcome', async () => {
      const action = RoundActions.endRound({
        outcome: OutcomeEnum.None,
        winningPositions: null,
      });
      actions$ = of(action);

      const result = await firstValueFrom(effects.endRound$);
      expect(result).toEqual(RoundActions.switchRoundStartingPlayerIndex());
    });
  });

  describe('startRound$', () => {
    test('dispatches setCurrentPlayer when starting a new round', async () => {
      const startingPlayerIndex = 1;

      mockStore.overrideSelector(
        selectRoundStartingPlayerIndex,
        startingPlayerIndex
      );

      const action = RoundActions.startRound();

      actions$ = of(action);

      const result = await firstValueFrom(effects.startRound$);
      expect(result).toEqual(
        setCurrentPlayer({ currentPlayerIndex: startingPlayerIndex })
      );
    });
  });
});
