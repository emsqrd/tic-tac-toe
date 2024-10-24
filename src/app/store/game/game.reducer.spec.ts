import { gameReducer, GameState } from './game.reducer';
import { startGame, makeMove, endGame, switchGameMode } from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { Player } from '../../models/player';

describe('Game Reducer', () => {
  const currentPlayerMock: Player = {
    name: 'Player 1',
    piece: 'X',
    wins: 0,
  };

  const initialStateMock: GameState = {
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    outcome: OutcomeEnum.None,
    draws: 0,
    gameMode: GameModeEnum.TwoPlayer,
  };

  it('should return the initial state', () => {
    const state = gameReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialStateMock);
  });

  it('should handle startGame action', () => {
    const state = gameReducer(initialStateMock, startGame());
    expect(state.gameBoard).toEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.outcome).toEqual(OutcomeEnum.None);
  });

  it('should handle makeMove action', () => {
    const position = 0;
    const state = gameReducer(
      initialStateMock,
      makeMove({ position, currentPlayer: currentPlayerMock })
    );

    expect(state.gameBoard[position].gamePiece).toEqual(
      currentPlayerMock.piece
    );
  });

  it('should not allow a move on an already taken square', () => {
    const position = 0;
    const stateWithMove = gameReducer(
      initialStateMock,
      makeMove({ position, currentPlayer: currentPlayerMock })
    );
    const stateWithInvalidMove = gameReducer(
      stateWithMove,
      makeMove({ position, currentPlayer: currentPlayerMock })
    );
    expect(stateWithInvalidMove).toEqual(stateWithMove);
  });

  it('should handle endGame action with a win', () => {
    const winningPositions = [0, 1, 2];
    const state = gameReducer(
      initialStateMock,
      endGame({ outcome: OutcomeEnum.Win, winningPositions })
    );
    expect(state.outcome).toEqual(OutcomeEnum.Win);
    expect(state.gameBoard[0].isWinner).toBe(true);
    expect(state.gameBoard[1].isWinner).toBe(true);
    expect(state.gameBoard[2].isWinner).toBe(true);
  });

  it('should handle endGame action with a draw', () => {
    const state = gameReducer(
      initialStateMock,
      endGame({ outcome: OutcomeEnum.Draw, winningPositions: [] })
    );
    expect(state.outcome).toEqual(OutcomeEnum.Draw);
    expect(state.draws).toBe(1);
  });

  it('should handle switchGameMode action and switch game modes', () => {
    const state = gameReducer(initialStateMock, switchGameMode());
    expect(state.gameMode).toEqual(GameModeEnum.SinglePlayer);
  });
});
