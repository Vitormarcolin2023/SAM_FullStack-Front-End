import { inject, Injectable } from '@angular/core';
import { TokenDecode } from '../../models/token/token-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  tokenDecode = inject(TokenDecode);  

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.tokenDecode.getRole();
    return userRole ? roles.includes(userRole) : false;
  }

  logout() {
    this.tokenDecode.logout();
  }
}
