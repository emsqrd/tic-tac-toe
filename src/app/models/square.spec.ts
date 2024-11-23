import { Square } from './square';

describe('Square', () => {
  let square: Square;

  beforeEach(() => {
    square = new Square();
  });

  test('should initialize with empty game piece', () => {
    expect(square.gamePiece).toBe('');
  });

  test('should initialize with winner state as false', () => {
    expect(square.isWinner).toBe(false);
  });

  test('should update game piece when value is set', () => {
    square.gamePiece = 'X';
    expect(square.gamePiece).toBe('X');
  });

  test('should update winner state when value is set', () => {
    square.isWinner = true;
    expect(square.isWinner).toBe(true);
  });
});
