import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenInterface } from './token-interface';

@Injectable({
  providedIn: 'root'
})
export class TokenDecode {

  getDecodedToken(): TokenInterface | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode<TokenInterface>(token);
  }

  getRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded ? decoded.Role : null;
  }

  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded ? decoded.sub : null;
  }
}
