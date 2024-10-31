import { gameReducer, GameState } from './game.reducer';
import {
  startGame,
  makeMove,
  endGame,
  switchGameMode,
  resetDraws,
  startRound,
} from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { Player } from '../../models/player';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { PlayerState } from '../player/player.reducer';

describe('Game Reducer', () => {
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let currentPlayerMock: Player;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];
  });

  it('should return the initial state', () => {
    const state = gameReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialGameStateMock);
  });

  it('should handle startGame action', () => {
    const state = gameReducer(
      initialGameStateMock,
      startGame({ gameMode: initialGameStateMock.gameMode })
    );

    expect(state.gameMode).toEqual(initialGameStateMock.gameMode);
  });

  it('should handle startRound action', () => {
    const state = gameReducer(initialGameStateMock, startRound());

    expect(state.gameBoard).toEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.outcome).toEqual(OutcomeEnum.None);
  });

  it('should handle makeMove action when position is provided', () => {
    const position = 0;
    const state = gameReducer(
      initialGameStateMock,
      makeMove({ position, currentPlayer: currentPlayerMock })
    );

    expect(state.gameBoard[position].gamePiece).toEqual(
      currentPlayerMock.piece
    );
  });

  it('should handle makeMove action when no position is provided', () => {
    const state = gameReducer(
      initialGameStateMock,
      makeMove({ currentPlayer: currentPlayerMock })
    );

    const emptySquares = state.gameBoard.filter(
      (square) => square.gamePiece === ''
    );
    expect(emptySquares.length).toBe(8);
  });

  it('should handle endGame action with a win', () => {
    const winningPositions = [0, 1, 2];
    const state = gameReducer(
      initialGameStateMock,
      endGame({ outcome: OutcomeEnum.Win, winningPositions })
    );
    expect(state.outcome).toEqual(OutcomeEnum.Win);
    expect(state.gameBoard[0].isWinner).toBe(true);
    expect(state.gameBoard[1].isWinner).toBe(true);
    expect(state.gameBoard[2].isWinner).toBe(true);
  });

  it('should handle endGame action with a draw', () => {
    const state = gameReducer(
      initialGameStateMock,
      endGame({ outcome: OutcomeEnum.Draw, winningPositions: [] })
    );
    expect(state.outcome).toEqual(OutcomeEnum.Draw);
    expect(state.draws).toBe(1);
  });

  it('should handle switchGameMode action and switch game modes', () => {
    const state = gameReducer(initialGameStateMock, switchGameMode());
    expect(state.gameMode).toEqual(GameModeEnum.SinglePlayer);
  });

  it('should handle switchGameMode action and switch game modes back', () => {
    const state = gameReducer(
      { ...initialGameStateMock, gameMode: GameModeEnum.SinglePlayer },
      switchGameMode()
    );
    expect(state.gameMode).toEqual(GameModeEnum.TwoPlayer);
  });

  it('should handle resetDraws action', () => {
    const state = gameReducer(
      { ...initialGameStateMock, draws: 5 },
      resetDraws()
    );
    expect(state.draws).toEqual(0);
  });
});
