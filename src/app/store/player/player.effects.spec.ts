import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, firstValueFrom, EMPTY } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { switchPlayer } from './player.actions';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { PlayerState } from './player.reducer';
import { GameState } from '../game/game.reducer';
import { selectCurrentPlayer } from './player.selectors';
import { RoundActions } from '../round/round.actions';
import { selectGameMode } from '../game/game.selectors';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { selectGameBoard } from '../round/round.selectors';
import { getInitialRoundStateMock } from '../mocks/round-mocks';
import { RoundState } from '../round/round.reducer';
import { TestScheduler } from 'rxjs/testing';

describe('PlayerEffects', () => {
  let actions$: Observable<any>;
  let effects: PlayerEffects;
  let store: MockStore<{ game: GameState; player: PlayerState }>;
  let initialPlayerState: PlayerState;
  let initialGameState: GameState;
  let initialRoundState: RoundState;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    initialPlayerState = getInitialPlayerStateMock();
    initialGameState = getInitialGameStateMock();
    initialRoundState = getInitialRoundStateMock();

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
    test('dispatches processCPUMove when current player is CPU in a single player game', async () => {
      const cpuCurrentPlayer = {
        ...initialPlayerState.players[1],
        isCpu: true,
      };

      const emptyBoardState = initialRoundState.gameBoard;

      store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
      store.overrideSelector(selectCurrentPlayer, cpuCurrentPlayer);
      store.overrideSelector(selectGameBoard, emptyBoardState);

      actions$ = of(switchPlayer());

      const result = await firstValueFrom(effects.switchPlayer$);
      expect(result).toEqual(
        RoundActions.processCPUMove({ boardState: emptyBoardState })
      );
    });

    test('returns EMPTY when the current player is human', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const humanCurrentPlayer = {
          ...initialPlayerState.players[0],
          isCpu: false,
        };

        const emptyBoardState = initialRoundState.gameBoard;
        store.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
        store.overrideSelector(selectCurrentPlayer, humanCurrentPlayer);
        store.overrideSelector(selectGameBoard, emptyBoardState);

        actions$ = cold('(a|)', { a: switchPlayer() });

        expectObservable(effects.switchPlayer$).toBe('|');
      });
    });
  });
});
