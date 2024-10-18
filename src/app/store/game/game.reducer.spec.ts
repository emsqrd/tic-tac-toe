import { gameReducer, initialState, GameState } from './game.reducer';
import { startGame, makeMove, endGame, switchPlayer } from './game.actions';
import { Player } from '../../models/player';
import { Observable, of } from 'rxjs';
import { GameEffects } from './game.effects';
import { GameService } from '../../services/game.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Game Reducer with Effects', () => {
  let action$: Observable<any>;
  let effects: GameEffects;
  let gameService: jasmine.SpyObj<GameService>;

  beforeEach(() => {
    gameService = jasmine.createSpyObj('GameService', ['calculateWinner']);

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        provideMockActions(() => action$),
        provideMockStore({ initialState }),
        { provide: GameService, useValue: gameService },
      ],
    });

    effects = TestBed.inject(GameEffects);
  });

  it('should return the initial state', () => {
    const state = gameReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle startGame action', () => {
    const state = gameReducer(initialState, startGame());
    expect(state.gameBoard).toEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.winner).toBeNull();
    expect(state.isDraw).toBe(false);
  });

  it('should handle makeMove action', () => {
    const position = 0;
    // make a move
    let state = gameReducer(initialState, makeMove({ position }));
    expect(state.gameBoard[position].gamePiece).toBe('X');
  });

  fit('should handle makeMove action and declare a winner', (done) => {
    const moves = [0, 3, 1, 4, 2]; // X wins
    let state: GameState = initialState;

    gameService.calculateWinner.and.returnValue([0, 1, 2]);

    action$ = of(makeMove({ position: 2 }));

    moves.forEach((position) => {
      state = gameReducer(state, makeMove({ position }));
    });

    effects.makeMove$.subscribe((action) => {
      expect(action).toEqual(
        endGame({ winner: state.player1, winningPositions: [0, 1, 2] })
      );
      done();
    });

    // Debugging: Check the final state
    console.log('player 1:', state.player1);
    expect(state.winner).toEqual(state.player1);
    expect(state.player1.wins).toBe(1);
    expect(state.gameBoard[0].isWinner).toBe(true);
    expect(state.gameBoard[1].isWinner).toBe(true);
    expect(state.gameBoard[2].isWinner).toBe(true);
  });

  it('should handle makeMove action and declare a draw', () => {
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8]; // Draw
    let state: GameState = initialState;

    moves.forEach((position) => {
      state = gameReducer(state, makeMove({ position }));
    });

    expect(state.isDraw).toBe(true);
    expect(state.draws).toBe(1);
  });

  it('should handle endGame action', () => {
    const winner: Player = { name: 'Player 1', piece: 'X', wins: 1 };
    const winningPositions = [0, 1, 2];
    const state = gameReducer(
      initialState,
      endGame({ winner, winningPositions })
    );
    expect(state.winner).toEqual(winner);
  });

  it('should not allow a move on an already taken square', () => {
    const initialMove = makeMove({ position: 0 });
    let state = gameReducer(initialState, initialMove);

    // Attempt to make a move on the same position
    const secondMove = makeMove({ position: 0 });
    state = gameReducer(state, secondMove);

    // The state should remain unchanged after the second move
    expect(state.gameBoard[0].gamePiece).toBe('X');
    expect(state.currentPlayer.piece).toBe('O');
  });

  it('should highlight only the squares that resulted in the win', () => {
    const moves = [0, 1, 2, 3, 4, 5, 6];
    let state: GameState = initialState;

    moves.forEach((position) => {
      state = gameReducer(state, makeMove({ position }));
    });

    expect(state.winner).toEqual(state.player1);
    expect(state.player1.wins).toBe(1);
    expect(state.gameBoard[0].isWinner).toBe(false);
    expect(state.gameBoard[1].isWinner).toBe(false);
    expect(state.gameBoard[2].isWinner).toBe(true);
    expect(state.gameBoard[3].isWinner).toBe(false);
    expect(state.gameBoard[4].isWinner).toBe(true);
    expect(state.gameBoard[5].isWinner).toBe(false);
    expect(state.gameBoard[6].isWinner).toBe(true);
  });
});
