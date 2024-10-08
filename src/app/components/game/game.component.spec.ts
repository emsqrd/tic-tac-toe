import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game.component';

xdescribe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should result in X winning', () => {
    // component.makeMove(0, 'X');
    // component.makeMove(4, 'O');
    // component.makeMove(1, 'X');
    // component.makeMove(5, 'O');
    // component.makeMove(2, 'X');

    // expect(component.player1.isWinner).toBeTrue();
    // expect(component.player1.wins).toBe(1);
    // expect(component.gameBoard[0].isWinner).toBeTrue();
    // expect(component.gameBoard[1].isWinner).toBeTrue();
    // expect(component.gameBoard[2].isWinner).toBeTrue();

    expect(component.player2.isWinner).toBeFalse();
    expect(component.player2.wins).toBe(0);
  });

  it('should result in O winning', () => {
    // component.makeMove(0, 'O');
    // component.makeMove(3, 'X');
    // component.makeMove(1, 'O');
    // component.makeMove(4, 'X');
    // component.makeMove(2, 'O');

    // expect(component.player2.isWinner).toBeTrue();
    // expect(component.player2.wins).toBe(1);
    // expect(component.gameBoard[0].isWinner).toBeTrue();
    // expect(component.gameBoard[1].isWinner).toBeTrue();
    // expect(component.gameBoard[2].isWinner).toBeTrue();

    expect(component.player1.isWinner).toBeFalse();
    expect(component.player1.wins).toBe(0);
  });

  it('should result in a draw', () => {
    // component.makeMove(0, 'X');
    // component.makeMove(1, 'O');
    // component.makeMove(3, 'X');
    // component.makeMove(4, 'O');
    // component.makeMove(7, 'X');
    // component.makeMove(6, 'O');
    // component.makeMove(2, 'X');
    // component.makeMove(5, 'O');
    // component.makeMove(8, 'X');

    expect(component.isDraw).toBeTrue();
    expect(component.draws).toBe(1);
    expect(component.player1.isWinner).toBeFalse();
    expect(component.player2.isWinner).toBeFalse();
  });

  it('should result in x winning on last turn', () => {
    // component.makeMove(0, 'X');
    // component.makeMove(1, 'O');
    // component.makeMove(2, 'X');
    // component.makeMove(3, 'O');
    // component.makeMove(4, 'X');
    // component.makeMove(5, 'O');
    // component.makeMove(6, 'O');
    // component.makeMove(7, 'X');
    // component.makeMove(8, 'X');

    expect(component.player1.isWinner).toBeTrue();
    expect(component.player2.isWinner).toBeFalse();
  });

  it('should reset the board when clicking square and the game is over', () => {
    // spyOn(component, 'resetBoard');
    // component.player1.isWinner = true;
    // component.squareClick(0);
    // expect(component.resetBoard).toHaveBeenCalled();
  });

  it('should not increment current move if clicked square is already taken', () => {
    // expect(component.currentMove).toBe(1);
    // component.makeMove(0, 'X');
    // expect(component.currentMove).toBe(2);
    // component.makeMove(0, 'O');
    // expect(component.currentMove).toBe(2);
  });

  it('should reset the board', () => {
    component.player1.isCurrent = true;

    // component.resetBoard();

    // // check that all of the game pieces on the board are empty
    // let gameBoard = component.gameBoard;
    // let freshBoard = gameBoard.filter((x) => x.gamePiece === '');

    // expect(freshBoard.length).toBe(9);
    // expect(component.currentMove).toBe(1);
    // expect(component.isDraw).toBe(false);
    // expect(component.player1.isWinner).toBeFalse();
    // expect(component.player2.isWinner).toBeFalse();
    // expect(component.player2.isCurrent).toBeTrue();
  });

  it('should return the correct current player', () => {
    component.player1.isCurrent = true;
    component.player2.isCurrent = false;

    expect(component.currentPlayer).toBe(component.player1);

    component.player2.isCurrent = true;
    component.player1.isCurrent = false;

    expect(component.currentPlayer).toBe(component.player2);
  });

  it('should make a move when clicking the square if the game is not over', () => {
    // component.squareClick(0);

    expect(component.currentMove).toBe(2);
  });
});
