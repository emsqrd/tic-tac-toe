import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { RoundEffects } from './round.effects';

describe('RoundEffects', () => {
  let actions$: Observable<any>;
  let effects: RoundEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoundEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(RoundEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
