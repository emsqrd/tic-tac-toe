import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { switchPlayer, setCpuPlayer } from './player.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { PlayerState } from './player.reducer';
import { selectGameMode } from '../game/game.selectors';
import { GameState } from '../game/game.reducer';
import { selectCurrentPlayer } from './player.selectors';
import { RoundActions } from '../round/round.actions';

describe('PlayerEffects', () => {
  let actions$: Observable<any>;
  let effects: PlayerEffects;
  let store: MockStore<{ game: GameState; player: PlayerState }>;

  const initialPlayerState = getInitialPlayerStateMock();
  const initialGameState = getInitialGameStateMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            player: initialPlayerState,
            game: initialGameState,
          },
        }),
      ],
    });

    effects = TestBed.inject(PlayerEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch makeMove action if current player is CPU in single player mode', (done) => {
    const cpuCurrentPlayer = {
      ...initialPlayerState.players[1],
      isCpu: true,
    };

    // Dispatch the setCpuPlayer action to update the state
    store.dispatch(setCpuPlayer({ gamePiece: 'O' }));

    // Override the selectors used in the effect
    store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
    store.overrideSelector(selectCurrentPlayer, cpuCurrentPlayer);
    actions$ = of(switchPlayer());

    effects.switchPlayer$.subscribe((action) => {
      expect(action).toEqual(
        RoundActions.makeMove({
          currentPlayer: cpuCurrentPlayer,
        })
      );
      done();
    });
  });

  it('should dispatch NO_OP action if current player is not CPU', (done) => {
    const humanCurrentPlayer = {
      ...initialPlayerState.players[0],
      isCpu: false,
    };

    // Override the selectors used in the effect
    store.overrideSelector(selectCurrentPlayer, humanCurrentPlayer);
    actions$ = of(switchPlayer());

    effects.switchPlayer$.subscribe((action) => {
      expect(action).toEqual({ type: 'NO_OP' });
      done();
    });
  });

  it('should dispatch NO_OP action if game mode is not single player', (done) => {
    store.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);

    actions$ = of(switchPlayer());

    effects.switchPlayer$.subscribe((action) => {
      expect(action).toEqual({ type: 'NO_OP' });
      done();
    });
  });
});
