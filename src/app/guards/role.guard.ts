import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenDecode } from '../models/token/token-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenDecode);
  const router = inject(Router);

  const role = tokenService.getRole();
  const allowedRoles = route.data['roles'] as Array<string>;

  if(!role) {
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles.includes(role)) {
    return true;
  }

  router.navigate(['/acesso-negado']);
  return false;
};
