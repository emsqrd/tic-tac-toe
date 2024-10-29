import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { switchPlayer } from './player.actions';
import { makeMove } from '../game/game.actions';
import { selectCurrentPlayer } from './player.selectors';
import { PlayerState } from './player.reducer';
import { Action } from '@ngrx/store';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { Player } from '../../models/player';
import { selectGameMode } from '../game/game.selectors';
import { GameModeEnum } from '../../enums/game-mode.enum';

describe('PlayerEffects', () => {
  let actions$: Observable<Action>;
  let effects: PlayerEffects;
  let storeMock: MockStore<{ player: PlayerState }>;
  let initialPlayerStateMock: PlayerState;
  let currentPlayerMock: Player;

  beforeEach(() => {
    initialPlayerStateMock = getInitialPlayerStateMock();

    TestBed.configureTestingModule({
      providers: [
        PlayerEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { player: initialPlayerStateMock } }),
      ],
    });

    effects = TestBed.inject(PlayerEffects);
    storeMock = TestBed.inject(MockStore);

    initialPlayerStateMock = getInitialPlayerStateMock();
    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    storeMock.setState({ player: initialPlayerStateMock });
  });

  afterEach(() => {
    storeMock.resetSelectors();
  });

  it('should dispatch makeMove when gameMode is Single Player and currentPlayer is Player 2', (done) => {
    const action = switchPlayer();

    // todo: maybe think about how to better use current player logic here
    // todo: initialPlayerStateMock.player[1] or actually mock it out?
    const outcome = makeMove({
      currentPlayer: initialPlayerStateMock.players[1],
    });

    actions$ = of(action);

    storeMock.overrideSelector(
      selectCurrentPlayer,
      initialPlayerStateMock.players[1]
    );

    storeMock.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);

    effects.switchPlayer$.subscribe((result) => {
      expect(result).toEqual(outcome);
      done();
    });
  });

  it('should dispatch NO_OP when gameMode is Single Player and currentPlayer is not Player 2', (done) => {
    const action = switchPlayer();
    const outcome = { type: 'NO_OP' };

    actions$ = of(action);

    storeMock.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);

    effects.switchPlayer$.subscribe((result) => {
      expect(result).toEqual(outcome);
      done();
    });
  });

  it('should dispatch NO_OP when gameMode is not Single Player', (done) => {
    const action = switchPlayer();
    const outcome = { type: 'NO_OP' };

    actions$ = of(action);
    storeMock.overrideSelector(selectGameMode, GameModeEnum.TwoPlayer);

    effects.switchPlayer$.subscribe((result) => {
      expect(result).toEqual(outcome);
      done();
    });
  });

  // ! Ignoring this test for now
  // xit('should handle multiple switchPlayer actions correctly', (done) => {
  //   const action1 = switchPlayer();
  //   const action2 = switchPlayer();
  //   const currentPlayer1 = initialState.player.players[0];
  //   const currentPlayer2 = initialState.player.players[1];
  //   const outcome1 = { type: 'NO_OP' };
  //   const outcome2 = simulateMove({ currentPlayer: currentPlayer2 });

  //   actions$ = of(action1, action2);
  //   storeMock.overrideSelector(selectCurrentPlayer, currentPlayer1);

  //   effects.switchPlayer$.subscribe((result) => {
  //     expect(result).toEqual(outcome1);
  //     storeMock.overrideSelector(selectCurrentPlayer, currentPlayer2);

  //     effects.switchPlayer$.subscribe((result2) => {
  //       expect(result2).toEqual(outcome2);
  //       done();
  //     });
  //   });
  // });
});
