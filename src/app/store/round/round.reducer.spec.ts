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

  test('should return initial state', () => {
    const state = roundReducer(undefined, { type: '@@INIT' });
    expect(state).toStrictEqual(initialRoundStateMock);
  });

  test('should handle startRound', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.initializeRound()
    );

    expect(state.gameBoard).toStrictEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.outcome).toBe(OutcomeEnum.None);
  });

  test('should handle endRound with win condition', () => {
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

  test('should handle endRound with draw condition', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.completeRound({
        outcome: OutcomeEnum.Draw,
        winningPositions: [],
      })
    );
    expect(state.outcome).toBe(OutcomeEnum.Draw);
  });

  test('should handle setProcessingMove', () => {
    const processingMove = true;
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.setProcessingState({ isProcessing: processingMove })
    );
    expect(state.processingMove).toBe(processingMove);
  });

  test('should set board position with player piece', () => {
    const position = 0;
    const piece = currentPlayerMock.piece;
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.updateBoard({ position, piece })
    );

    expect(state.gameBoard[0].gamePiece).toBe(piece);
  });

  test('should switch round starting player index', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.switchRoundStartingPlayerIndex()
    );

    expect(state.roundStartingPlayerIndex).toBe(1);
  });

  test('should reset round starting player index to 0', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.resetRoundStartingPlayerIndex()
    );

    expect(state.roundStartingPlayerIndex).toBe(0);
  });
});
