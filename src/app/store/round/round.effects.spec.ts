import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, firstValueFrom, lastValueFrom } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { RoundEffects } from './round.effects';
import { GameService } from '../../services/game.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { getInitialRoundStateMock } from '../mocks/round-mocks';
import { RoundActions } from './round.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';
import {
  selectGameBoard,
  selectRoundStartingPlayerIndex,
} from './round.selectors';
import { selectGameMode } from '../game/game.selectors';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
import { selectGameDifficulty } from '../game/game.selectors';

describe('RoundEffects', () => {
  let actions$: Observable<any>;
  let effects: RoundEffects;
  let gameService: jest.Mocked<GameService>;
  let store: MockStore;

  beforeEach(() => {
    const mockGameService = {
      determineOutcome: jest.fn(),
      calculateWinner: jest.fn(),
      makeHardCpuMove: jest.fn(),
      makeMediumCpuMove: jest.fn(),
      getRandomEmptySquare: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RoundEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            game: getInitialGameStateMock(),
            round: getInitialRoundStateMock(),
            player: getInitialPlayerStateMock(),
          },
        }),
        { provide: GameService, useValue: mockGameService },
      ],
    });

    effects = TestBed.inject(RoundEffects);
    store = TestBed.inject(MockStore);
    gameService = TestBed.inject(GameService) as jest.Mocked<GameService>;
  });

  describe('initializeRound$', () => {
    test('dispatches correct actions for human vs human game', async () => {
      const startingPlayerIndex = 0;
      store.overrideSelector(
        selectRoundStartingPlayerIndex,
        startingPlayerIndex
      );
      store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);
      store.overrideSelector(selectGameBoard, []);

      actions$ = of(RoundActions.initializeRound());

      const result = await firstValueFrom(effects.initializeRound$);
      expect(result).toEqual(
        expect.objectContaining({
          type: expect.stringMatching(/Round|Player/),
        })
      );
    });

    test('includes CPU move action when CPU starts in single player mode', async () => {
      const startingPlayerIndex = 1; // CPU player
      store.overrideSelector(
        selectRoundStartingPlayerIndex,
        startingPlayerIndex
      );
      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      store.overrideSelector(selectGameBoard, []);

      actions$ = of(RoundActions.initializeRound());

      const results = await lastValueFrom(
        effects.initializeRound$.pipe(toArray())
      );
      expect(
        results.some((action) => action.type.includes('CPU'))
      ).toBeTruthy();
    });
  });

  describe('completeRound$', () => {
    test('dispatches updatePlayerWins for win outcome', async () => {
      actions$ = of(
        RoundActions.completeRound({
          outcome: OutcomeEnum.Win,
          winningPositions: [0, 1, 2],
        })
      );

      const results = await lastValueFrom(
        effects.completeRound$.pipe(toArray())
      );
      expect(results).toContainEqual(
        expect.objectContaining({ type: '[Player] Update Player Wins' })
      );
      expect(results).toContainEqual(
        RoundActions.switchRoundStartingPlayerIndex()
      );
    });

    test('dispatches updateDraws for draw outcome', async () => {
      actions$ = of(
        RoundActions.completeRound({
          outcome: OutcomeEnum.Draw,
          winningPositions: undefined,
        })
      );

      const results = await lastValueFrom(
        effects.completeRound$.pipe(toArray())
      );
      expect(results).toContainEqual(
        expect.objectContaining({ type: '[Game] Update Draws' })
      );
      expect(results).toContainEqual(
        RoundActions.switchRoundStartingPlayerIndex()
      );
    });
  });

  describe('processHumanMove$', () => {
    test('processes human move and evaluates game state', async () => {
      const position = 4;
      const piece = 'X';
      actions$ = of(RoundActions.processHumanMove({ position, piece }));

      const results = await lastValueFrom(
        effects.processHumanMove$.pipe(toArray())
      );
      expect(results).toContainEqual(
        RoundActions.setProcessingState({ isProcessing: true })
      );
      expect(results).toContainEqual(
        RoundActions.updateBoard({ position, piece })
      );
    });
  });

  describe('processCPUMove$', () => {
    test('processes CPU move with appropriate delay', async () => {
      const boardState = Array(9).fill({ gamePiece: '', isWinner: false });
      const position = 4;

      gameService.makeHardCpuMove.mockReturnValue(position);

      actions$ = of(RoundActions.processCPUMove({ boardState }));

      const results = await lastValueFrom(
        effects.processCPUMove$.pipe(toArray())
      );
      expect(
        results.every((action) => action.type.includes('Round'))
      ).toBeTruthy();
    });

    const difficultyTestCases = [
      ['Easy', GameDifficultyEnum.Easy, 'getRandomEmptySquare'] as const,
      ['Medium', GameDifficultyEnum.Medium, 'makeMediumCpuMove'] as const,
      ['Hard', GameDifficultyEnum.Hard, 'makeHardCpuMove'] as const,
    ];

    test.each(difficultyTestCases)(
      'makes correct move for %s difficulty',
      async (_, difficulty, methodName) => {
        const boardState = Array(9).fill({ gamePiece: '', isWinner: false });
        store.overrideSelector(selectGameDifficulty, difficulty);
        const method = gameService[methodName as keyof typeof gameService];
        (method as jest.Mock).mockReturnValue(4);

        actions$ = of(RoundActions.processCPUMove({ boardState }));

        const results = await lastValueFrom(
          effects.processCPUMove$.pipe(toArray())
        );
        expect(method).toHaveBeenCalled();
        expect(results).toContainEqual(
          expect.objectContaining({ type: '[Round] Update Board' })
        );
      }
    );
  });

  describe('evaluateRoundStatus$', () => {
    test('completes round when winner is determined', async () => {
      const boardState = Array(9).fill({ gamePiece: '', isWinner: false });
      gameService.determineOutcome.mockReturnValue(OutcomeEnum.Win);
      gameService.calculateWinner.mockReturnValue([0, 1, 2]);

      actions$ = of(RoundActions.evaluateRoundStatus({ boardState }));

      const result = await firstValueFrom(effects.evaluateRoundStatus$);
      expect(result).toEqual(
        RoundActions.completeRound({
          outcome: OutcomeEnum.Win,
          winningPositions: [0, 1, 2],
        })
      );
    });

    test('switches player when no winner is found', async () => {
      const boardState = Array(9).fill({ gamePiece: '', isWinner: false });
      gameService.determineOutcome.mockReturnValue(OutcomeEnum.None);
      gameService.calculateWinner.mockReturnValue(null);

      actions$ = of(RoundActions.evaluateRoundStatus({ boardState }));

      const result = await firstValueFrom(effects.evaluateRoundStatus$);
      expect(result.type).toBe('[Player] Switch Player');
    });

    test('handles full board draw scenario', async () => {
      const fullBoardState = Array(9).fill({ gamePiece: 'X', isWinner: false });
      gameService.determineOutcome.mockReturnValue(OutcomeEnum.Draw);

      actions$ = of(
        RoundActions.evaluateRoundStatus({ boardState: fullBoardState })
      );

      const result = await firstValueFrom(effects.evaluateRoundStatus$);
      expect(result).toEqual(
        RoundActions.completeRound({
          outcome: OutcomeEnum.Draw,
          winningPositions: undefined,
        })
      );
    });
  });

  // Clean up after each test
  afterEach(() => {
    store.resetSelectors();
  });
});
