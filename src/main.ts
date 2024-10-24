import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { gameReducer } from './app/store/game/game.reducer';
import { provideEffects } from '@ngrx/effects';
import { GameEffects } from './app/store/game/game.effects';
import { playerReducer } from './app/store/player/player.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideStore({ game: gameReducer, player: playerReducer }),
    provideStoreDevtools({ maxAge: 25 }),
    provideEffects([GameEffects]),
  ],
}).catch((err) => console.error(err));
