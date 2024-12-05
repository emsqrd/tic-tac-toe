import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';
import { GameState } from '../game/game.reducer';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { getInitialRoundStateMock } from '../mocks/round-mocks';
import { PlayerState } from '../player/player.reducer';
import { RoundActions } from './round.actions';
import { roundReducer, RoundState } from './round.reducer';

describe('Round Reducer', () => {
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;
  let currentPlayerMock: Player;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();
    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];
  });

  test('returns initial state', () => {
    const state = roundReducer(undefined, { type: '@@INIT' });
    expect(state).toStrictEqual(initialRoundStateMock);
  });

  test('initializes round with empty board and no outcome', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.initializeRound()
    );

    expect(state.gameBoard).toStrictEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.outcome).toBe(OutcomeEnum.None);
  });

  test('marks winning positions when round completes with win', () => {
    const winningPositions = [0, 1, 2];
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.completeRound({ outcome: OutcomeEnum.Win, winningPositions })
    );

    expect(state.outcome).toBe(OutcomeEnum.Win);
    expect(state.gameBoard[0].isWinner).toBe(true);
    expect(state.gameBoard[1].isWinner).toBe(true);
    expect(state.gameBoard[2].isWinner).toBe(true);
  });

  test('does not mark winning positions when round completes with draw', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.completeRound({
        outcome: OutcomeEnum.Draw,
        winningPositions: [],
      })
    );

    expect(state.outcome).toBe(OutcomeEnum.Draw);
    state.gameBoard.forEach((square) => {
      expect(square.isWinner).toBe(false);
    });
  });

  test('handles undefined winning positions when completing round', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.completeRound({
        outcome: OutcomeEnum.Draw,
        winningPositions: undefined,
      })
    );

    expect(state.outcome).toBe(OutcomeEnum.Draw);
    state.gameBoard.forEach((square) => {
      expect(square.isWinner).toBe(false);
    });
  });

  test('updates outcome when round ends in draw', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.completeRound({
        outcome: OutcomeEnum.Draw,
        winningPositions: [],
      })
    );
    expect(state.outcome).toBe(OutcomeEnum.Draw);
  });

  test('updates processing move state', () => {
    const processingMove = true;
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.setProcessingState({ isProcessing: processingMove })
    );
    expect(state.processingMove).toBe(processingMove);
  });

  test('updates board position with player piece', () => {
    const position = 0;
    const piece = currentPlayerMock.piece;
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.updateBoard({ position, piece })
    );

    expect(state.gameBoard[0].gamePiece).toBe(piece);
  });

  test('clears board when update board action is called with clear flag', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.updateBoard({ clear: true, position: 0, piece: '' })
    );

    expect(state.gameBoard).toStrictEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
  });

  test('increments round starting player index', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.switchRoundStartingPlayerIndex()
    );

    expect(state.roundStartingPlayerIndex).toBe(1);
  });

  test('resets round starting player index to 0', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.resetRoundStartingPlayerIndex()
    );

    expect(state.roundStartingPlayerIndex).toBe(0);
  });
});
