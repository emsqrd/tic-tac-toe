import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { gameReducer } from './app/store/reducers/game.reducer';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, provideStore({ game: gameReducer })],
}).catch((err) => console.error(err));
