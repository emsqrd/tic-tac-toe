import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { GameEffects } from './game.effects';
import { GameService } from '../../services/game.service';
import { makeMove, endGame, switchPlayer } from './game.actions';
import { GameState } from './game.reducer';
import { selectGameBoard, selectCurrentPlayer } from './game.selectors';

describe('GameEffects', () => {
  let actions$: Observable<any>;
  let effects: GameEffects;
  let store: MockStore<{ game: GameState }>;
  let gameService: jasmine.SpyObj<GameService>;

  const initialState = {
    game: {
      board: Array(9).fill({ gamePiece: '' }),
      currentPlayer: { piece: 'X', name: 'Player 1', wins: 0 },
    },
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('GameService', ['calculateWinner']);

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: GameService, useValue: spy },
      ],
    });

    effects = TestBed.inject(GameEffects);
    store = TestBed.inject(MockStore);
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should dispatch endGame with winner when there is a winning move', (done) => {
    const action = makeMove({ position: 0 });
    const winningPositions = [0, 1, 2];
    const updatedBoard = initialState.game.board.map((cell, index) =>
      winningPositions.includes(index) ? { gamePiece: 'X' } : cell
    );
    store.overrideSelector(selectGameBoard, updatedBoard);
    gameService.calculateWinner.and.returnValue(winningPositions);

    actions$ = of(action);

    effects.makeMove$.subscribe((result) => {
      expect(result).toEqual(
        endGame({ winner: initialState.game.currentPlayer, winningPositions })
      );
      done();
    });
  });

  it('should dispatch endGame with no winner when the board is full', (done) => {
    const action = makeMove({ position: 0 });
    const fullBoard = Array(9).fill({ gamePiece: 'X' });
    store.overrideSelector(selectGameBoard, fullBoard);
    gameService.calculateWinner.and.returnValue(null);

    actions$ = of(action);

    effects.makeMove$.subscribe((result) => {
      expect(result).toEqual(endGame({ winner: null, winningPositions: null }));
      done();
    });
  });

  it('should dispatch switchPlayer when there is no winner and the board is not full', (done) => {
    const action = makeMove({ position: 0 });
    const notFullBoard = Array(9).fill({ gamePiece: '', isWinner: false });
    store.overrideSelector(selectGameBoard, notFullBoard);
    gameService.calculateWinner.and.returnValue(null);

    actions$ = of(action);

    effects.makeMove$.subscribe((result) => {
      expect(result).toEqual(switchPlayer());
      done();
    });
  });

  it('should dispatch switchPlayer when endGame is dispatched', (done) => {
    const action = endGame({ winner: null, winningPositions: null });

    actions$ = of(action);

    effects.endGame$.subscribe((result) => {
      expect(result).toEqual(switchPlayer());
      done();
    });
  });
});
