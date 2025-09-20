import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StatusMentor } from '../models/mentor/mentor';

export const mentorStatusGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const status = localStorage.getItem('mentorStatus');

  if (status === StatusMentor.ATIVO) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false; 
  }
};

