import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mentorStatusGuard } from './mentor-status.guard';

describe('mentorStatusGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mentorStatusGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
