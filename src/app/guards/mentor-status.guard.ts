import { CanActivateFn } from '@angular/router';

export const mentorStatusGuard: CanActivateFn = (route, state) => {
  return true;
};
