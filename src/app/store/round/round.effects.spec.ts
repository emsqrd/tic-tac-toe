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
import { switchPlayer, updatePlayerWins } from '../player/player.actions';
import { updateDraws } from '../game/game.actions';
import { selectGameBoard } from './round.selectors';
import { selectCurrentPlayer } from '../player/player.selectors';

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

    gameService = jasmine.createSpyObj('GameService', [
      'calculateWinner',
      'determineOutcome',
      'makeCpuMove',
    ]);

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

  it('should dispatch the makeCpuMove action with correct sequence', (done) => {
    const cpuPlayer = {
      ...currentPlayerMock,
      isCpu: true,
    };
    const mockGameBoard = Array(9).fill({ gamePiece: '', isWinner: false });
    const position = 0;

    // Override selectors used in the effect
    mockStore.overrideSelector(selectCurrentPlayer, cpuPlayer);
    mockStore.overrideSelector(selectGameBoard, mockGameBoard);
    gameService.getRandomEmptySquare.and.returnValue(position);

    const action = RoundActions.makeCPUMove();

    actions$ = of(action);

    const expectedActions = [
      RoundActions.setProcessingMove({ processingMove: true }),
      RoundActions.setBoardPosition({ position, piece: cpuPlayer.piece }),
    ];

    spyOn<any>(effects, 'applyDelay').and.callFake(mockDelay);

    effects.makeCpuMove$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual(expectedActions);
      expect(effects['applyDelay']).toHaveBeenCalledWith(500);
      expect(gameService.getRandomEmptySquare).toHaveBeenCalledWith(
        mockGameBoard
      );
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

    gameService.calculateWinner.and.returnValue(winningPositions);
    gameService.determineOutcome.and.returnValue(outcome);

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
    gameService.calculateWinner.and.returnValue(null);
    gameService.determineOutcome.and.returnValue(outcome);

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

    gameService.calculateWinner.and.returnValue(null);
    gameService.determineOutcome.and.returnValue(OutcomeEnum.None);

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
