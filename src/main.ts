import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { reducers } from './app/store';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, provideStore({ ...reducers })],
}).catch((err) => console.error(err));
