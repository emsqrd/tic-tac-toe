import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import { gameReducer } from './app/store/game/game.reducer';
import { playerReducer } from './app/store/player/player.reducer';
import { roundReducer } from './app/store/round/round.reducer';

import { GameEffects } from './app/store/game/game.effects';
import { PlayerEffects } from './app/store/player/player.effects';
import { RoundEffects } from './app/store/round/round.effects';

const reducers = {
  game: gameReducer,
  player: playerReducer,
  round: roundReducer,
};

const effects = [GameEffects, PlayerEffects, RoundEffects];

const providers = [
  ...appConfig.providers,
  provideStore(reducers),
  provideStoreDevtools({ maxAge: 25 }),
  provideEffects(effects),
];

bootstrapApplication(AppComponent, { providers }).catch((err) =>
  console.error('Error bootstrapping application:', err)
);
