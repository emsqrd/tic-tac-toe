import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { switchPlayer } from './player.actions';
import { simulateMove } from '../game/game.actions';
import { selectCurrentPlayer } from './player.selectors';
import { GameState } from '../game/game.reducer';
import { PlayerState } from './player.reducer';
import { Action } from '@ngrx/store';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { OutcomeEnum } from '../../enums/outcome.enum';

describe('PlayerEffects', () => {
  let actions$: Observable<Action>;
  let effects: PlayerEffects;
  let store: MockStore<{ game: GameState; player: PlayerState }>;

  const initialState = {
    game: {
      gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
      outcome: OutcomeEnum.None,
      draws: 0,
      gameMode: GameModeEnum.TwoPlayer,
    },
    player: {
      players: [
        {
          name: 'Player 1',
          piece: 'X',
          wins: 0,
        },
        {
          name: 'Player 2',
          piece: 'O',
          wins: 0,
        },
      ],
      currentPlayerIndex: 0,
    },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
      ],
    });

    effects = TestBed.inject(PlayerEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  // ! Ignoring for now until I decide on if I need simulateMove at all
  xit('should dispatch simulateMove when currentPlayer is Player 2', (done) => {
    const action = switchPlayer();
    const currentPlayer = initialState.player.players[1];
    const outcome = simulateMove({ currentPlayer });

    actions$ = of(action);
    store.overrideSelector(selectCurrentPlayer, currentPlayer);

    effects.switchPlayer$.subscribe((result) => {
      expect(result).toEqual(outcome);
      done();
    });
  });

  it('should dispatch NO_OP when currentPlayer is not Player 2', (done) => {
    const action = switchPlayer();
    const currentPlayer = initialState.player.players[0];
    const outcome = { type: 'NO_OP' };

    actions$ = of(action);
    store.overrideSelector(selectCurrentPlayer, currentPlayer);

    effects.switchPlayer$.subscribe((result) => {
      expect(result).toEqual(outcome);
      done();
    });
  });

  // ! Ignoring this test for now
  xit('should handle multiple switchPlayer actions correctly', (done) => {
    const action1 = switchPlayer();
    const action2 = switchPlayer();
    const currentPlayer1 = initialState.player.players[0];
    const currentPlayer2 = initialState.player.players[1];
    const outcome1 = { type: 'NO_OP' };
    const outcome2 = simulateMove({ currentPlayer: currentPlayer2 });

    actions$ = of(action1, action2);
    store.overrideSelector(selectCurrentPlayer, currentPlayer1);

    effects.switchPlayer$.subscribe((result) => {
      expect(result).toEqual(outcome1);
      store.overrideSelector(selectCurrentPlayer, currentPlayer2);

      effects.switchPlayer$.subscribe((result2) => {
        expect(result2).toEqual(outcome2);
        done();
      });
    });
  });
});
