import { getInitialRoundStateMock } from '../mocks/round-mocks';
import {
  selectGameBoard,
  selectOutcome,
  selectProcessingMove,
  selectRoundStartingPlayerIndex,
} from './round.selectors';

describe('Round Selectors', () => {
  let initialRoundStateMock: ReturnType<typeof getInitialRoundStateMock>;

  beforeEach(() => {
    initialRoundStateMock = getInitialRoundStateMock();
  });

  test('initial state mock has required properties', () => {
    expect(initialRoundStateMock).toBeDefined();
    expect(initialRoundStateMock.gameBoard).toBeDefined();
    expect(initialRoundStateMock.outcome).toBeDefined();
  });

  describe('selectGameBoard', () => {
    test('returns game board from state', () => {
      const result = selectGameBoard.projector(initialRoundStateMock);
      expect(result).toBe(initialRoundStateMock.gameBoard);
    });
  });

  describe('selectOutcome', () => {
    test('returns outcome from state', () => {
      const result = selectOutcome.projector(initialRoundStateMock);
      expect(result).toBe(initialRoundStateMock.outcome);
    });
  });

  describe('selectProcessingMove', () => {
    test('returns processing move status from state', () => {
      const result = selectProcessingMove.projector(initialRoundStateMock);
      expect(result).toBe(initialRoundStateMock.processingMove);
    });
  });

  describe('selectRoundStartingPlayerIndex', () => {
    test('returns round starting player index from state', () => {
      const result = selectRoundStartingPlayerIndex.projector(
        initialRoundStateMock
      );
      expect(result).toBe(initialRoundStateMock.roundStartingPlayerIndex);
    });
  });
});
