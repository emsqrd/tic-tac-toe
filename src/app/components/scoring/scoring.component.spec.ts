import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ScoringComponent } from './scoring.component';
import { Player } from '../../models/player';
import {
  selectPlayer1,
  selectPlayer2,
  selectCurrentPlayer,
  selectDraws,
  selectOutcome,
} from '../../store/game/game.selectors';
import { OutcomeEnum } from '../../enums/outcome.enum';

fdescribe('ScoringComponent', () => {
  let component: ScoringComponent;
  let fixture: ComponentFixture<ScoringComponent>;
  let store: MockStore;
  const initialState = {
    game: {
      gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
      player1: {
        name: 'Player 1',
        piece: 'X',
        wins: 0,
      },
      player2: {
        name: 'Player 2',
        piece: 'O',
        wins: 0,
      },
      currentPlayer: {
        name: 'Player 1',
        piece: 'X',
        wins: 0,
      },
      outcome: OutcomeEnum.None,
      draws: 0,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoringComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select player1 from the store', () => {
    store.overrideSelector(selectPlayer1, initialState.game.player1);
    component.player1$.subscribe((player1) => {
      expect(player1).toEqual(initialState.game.player1);
    });
  });

  it('should select player2 from the store', () => {
    store.overrideSelector(selectPlayer2, initialState.game.player2);
    component.player2$.subscribe((player2) => {
      expect(player2).toEqual(initialState.game.player2);
    });
  });

  it('should select currentPlayer from the store', () => {
    store.overrideSelector(
      selectCurrentPlayer,
      initialState.game.currentPlayer
    );
    component.currentPlayer$.subscribe((currentPlayer) => {
      expect(currentPlayer).toEqual(initialState.game.currentPlayer);
    });
  });

  it('should select outcome from the store', () => {
    store.overrideSelector(selectOutcome, initialState.game.outcome);
    component.outcome$.subscribe((outcome) => {
      expect(outcome).toEqual(initialState.game.outcome);
    });
  });

  it('should select draws from the store', () => {
    store.overrideSelector(selectDraws, initialState.game.draws);
    component.draws$.subscribe((draws) => {
      expect(draws).toEqual(initialState.game.draws);
    });
  });

  it('should return true for isResult when there is a winner', () => {
    component.outcome = OutcomeEnum.Win;
    expect(component.isResult).toBeTrue();
  });

  it('should return true for isResult when there is a draw', () => {
    expect(component.isResult).toBeTrue();
  });

  it('should return false for isResult when there is no winner or draw', () => {
    expect(component.isResult).toBeFalse();
  });

  it('should return true for selectPlayer1 when currentPlayer is player1', () => {
    component.currentPlayer = initialState.game.player1;
    expect(component.selectPlayer1).toBeTrue();
  });

  it('should return true for selectPlayer2 when currentPlayer is player2', () => {
    component.currentPlayer = initialState.game.player2;
    expect(component.selectPlayer2).toBeTrue();
  });

  it('should return true for selectDraw when there is a draw', () => {
    expect(component.selectDraw).toBeTrue();
  });

  it('should return true for player1Wins when winner is player1', () => {
    expect(component.player1Wins).toBeTrue();
  });

  it('should return true for player2Wins when winner is player2', () => {
    expect(component.player2Wins).toBeTrue();
  });
});
