import { Square } from './square';

describe('Square', () => {
  let square: Square;

  beforeEach(() => {
    square = new Square();
  });

  it('should create with default values', () => {
    expect(square.gamePiece).toBe('');
    expect(square.isWinner).toBeFalsy();
  });

  it('should allow setting game piece', () => {
    square.gamePiece = 'X';
    expect(square.gamePiece).toBe('X');
  });

  it('should allow setting winner state', () => {
    square.isWinner = true;
    expect(square.isWinner).toBe(true);
  });
});
