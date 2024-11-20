import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
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

  it('should return the initial state', () => {
    const state = roundReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialRoundStateMock);
  });

  it('should handle startRound action', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.startRound()
    );

    expect(state.gameBoard).toEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.outcome).toEqual(OutcomeEnum.None);
  });

  it('should handle endRound action with a win', () => {
    const winningPositions = [0, 1, 2];
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.endRound({ outcome: OutcomeEnum.Win, winningPositions })
    );

    expect(state.outcome).toEqual(OutcomeEnum.Win);
    expect(state.gameBoard[0].isWinner).toBe(true);
    expect(state.gameBoard[1].isWinner).toBe(true);
    expect(state.gameBoard[2].isWinner).toBe(true);
  });

  it('should handle endRound action with a draw', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.endRound({ outcome: OutcomeEnum.Draw, winningPositions: [] })
    );
    expect(state.outcome).toEqual(OutcomeEnum.Draw);
  });

  it('should handle setProcessingMove action', () => {
    const processingMove = true;
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.setProcessingMove({ processingMove })
    );
    expect(state.processingMove).toBe(processingMove);
  });

  it('should set the board position', () => {
    const position = 0;
    const piece = currentPlayerMock.piece;
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.setBoardPosition({ position, piece })
    );

    expect(state.gameBoard[0].gamePiece).toBe(piece);
  });

  it('should swith the round starting player index', () => {
    const state = roundReducer(
      initialRoundStateMock,
      RoundActions.switchRoundStartingPlayerIndex()
    );

    expect(state.roundStartingPlayerIndex).toBe(1);
  });
});
