import { getInitialRoundStateMock } from '../mocks/round-mocks';
import { selectGameBoard, selectOutcome } from './round.selectors';

describe('Round Selectors', () => {
  let initialRoundStateMock = getInitialRoundStateMock();

  it('should select the game board', () => {
    const result = selectGameBoard.projector(initialRoundStateMock);
    expect(result).toEqual(initialRoundStateMock.gameBoard);
  });

  it('should select the outcome', () => {
    const result = selectOutcome.projector(initialRoundStateMock);
    expect(result).toEqual(initialRoundStateMock.outcome);
  });

  it('should have a valid initial state mock', () => {
    expect(initialRoundStateMock).toBeDefined();
    expect(initialRoundStateMock.gameBoard).toBeDefined();
    expect(initialRoundStateMock.outcome).toBeDefined();
  });
});
