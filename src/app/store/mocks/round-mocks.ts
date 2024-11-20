import { OutcomeEnum } from '../../enums/outcome.enum';
import { RoundState } from '../round/round.reducer';

export const getInitialRoundStateMock = (): RoundState => ({
  gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
  outcome: OutcomeEnum.None,
  processingMove: false,
  roundStartingPlayerIndex: 0,
});
