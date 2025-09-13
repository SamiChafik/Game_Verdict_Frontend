import { TestBed } from '@angular/core/testing';

import { FavoriteGameService } from './favorite-game.service';

describe('FavoriteGameService', () => {
  let service: FavoriteGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
