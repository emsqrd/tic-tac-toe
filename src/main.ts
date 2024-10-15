import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { gameReducer } from './app/store/game/game.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideStore({ game: gameReducer }),
    provideStoreDevtools({ maxAge: 25 }),
  ],
}).catch((err) => console.error(err));
