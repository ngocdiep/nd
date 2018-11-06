import { TestBed, async, inject } from '@angular/core/testing';

import { UnAuthGuard } from './unauth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnAuthGuard]
    });
  });

  it('should ...', inject([UnAuthGuard], (guard: UnAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
