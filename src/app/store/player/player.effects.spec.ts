import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, firstValueFrom } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { switchPlayer } from './player.actions';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { PlayerState } from './player.reducer';
import { GameState } from '../game/game.reducer';
import { selectCurrentPlayer } from './player.selectors';
import { RoundActions } from '../round/round.actions';

describe('PlayerEffects', () => {
  let actions$: Observable<any>;
  let effects: PlayerEffects;
  let store: MockStore<{ game: GameState; player: PlayerState }>;
  let initialPlayerState: PlayerState;
  let initialGameState: GameState;

  beforeEach(() => {
    initialPlayerState = getInitialPlayerStateMock();
    initialGameState = getInitialGameStateMock();

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

  describe('switchPlayer$', () => {
    test('dispatches makeCPUMove when current player is CPU', async () => {
      const cpuCurrentPlayer = {
        ...initialPlayerState.players[1],
        isCpu: true,
      };

      store.overrideSelector(selectCurrentPlayer, cpuCurrentPlayer);
      actions$ = of(switchPlayer());

      const result = await firstValueFrom(effects.switchPlayer$);
      expect(result).toEqual(RoundActions.makeCPUMove());
    });

    test('dispatches NO_OP when current player is human', async () => {
      const humanCurrentPlayer = {
        ...initialPlayerState.players[0],
        isCpu: false,
      };

      store.overrideSelector(selectCurrentPlayer, humanCurrentPlayer);
      actions$ = of(switchPlayer());

      const result = await firstValueFrom(effects.switchPlayer$);
      expect(result).toEqual({ type: 'NO_OP' });
    });
  });
});
