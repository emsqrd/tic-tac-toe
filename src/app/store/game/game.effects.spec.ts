import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { GameEffects } from './game.effects';
import { GameService } from '../../services/game.service';
import { attemptMove, makeMove, endGame } from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { switchPlayer, updatePlayerWins } from '../player/player.actions';
import { GameState } from './game.reducer';
import { PlayerState } from '../player/player.reducer';

const initialGameStateMock: GameState = {
  gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
  outcome: OutcomeEnum.None,
  draws: 0,
};

const initialPlayerStateMock: PlayerState = {
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

describe('GameEffects', () => {
  let actions$: Observable<any>;
  let effects: GameEffects;
  let gameService: jasmine.SpyObj<GameService>;
  let mockStore: MockStore;

  beforeEach(() => {
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
  });

  it('should dispatch makeMove action on attemptMove if the square is not taken', (done) => {
    const action = attemptMove({
      position: 0,
      currentPlayer: { name: 'Player 1', piece: 'X', wins: 0 },
    });
    actions$ = of(action);

    effects.attemptMove$.subscribe((result) => {
      expect(result).toEqual(
        makeMove({
          position: 0,
          currentPlayer: { name: 'Player 1', piece: 'X', wins: 0 },
        })
      );
      done();
    });
  });

  it('should dispatch endGame action with Win outcome if there is a winner', (done) => {
    const action = makeMove({
      position: 0,
      currentPlayer: { name: 'Player 1', piece: 'X', wins: 0 },
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

  it('should dispatch endGame action with Draw outcome if the board is full and no winner', (done) => {
    // simulate a full board without a winn
    const fullBoardMock = {
      ...initialGameStateMock,
      gameBoard: Array(9).fill({ gamePiece: 'X', isWinner: false }),
    };

    // set the mock state with the full board
    mockStore.setState({ game: fullBoardMock, player: initialPlayerStateMock });

    const action = makeMove({
      position: 0,
      currentPlayer: { name: 'Player 1', piece: 'X', wins: 0 },
    });
    actions$ = of(action);
    gameService.calculateWinner.and.returnValue(null);

    effects.makeMove$.subscribe((result) => {
      expect(result).toEqual(
        endGame({ outcome: OutcomeEnum.Draw, winningPositions: null })
      );
      done();
    });
  });

  it('should dispatch switchPlayer action if there is no winner and the board is not full', (done) => {
    const action = makeMove({
      position: 0,
      currentPlayer: { name: 'Player 1', piece: 'X', wins: 0 },
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
});
