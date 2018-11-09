import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('authService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
