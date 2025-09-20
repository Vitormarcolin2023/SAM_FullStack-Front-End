import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenInterface } from './token-interface';

@Injectable({
  providedIn: 'root',
})
export class TokenDecode {
  getDecodedToken(): TokenInterface | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode<TokenInterface>(token);
  }

  getRole(): string | null {
    const decoded = this.getDecodedToken();
    // Atenção: No seu token a propriedade é "Role" com 'R' maiúsculo.
    // Se não funcionar, verifique se no token é "role" com 'r' minúsculo.
    return decoded ? decoded.Role : null;
  }

  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded ? decoded.sub : null;
  }

  // ==================== ALTERAÇÃO 1 ====================
  // Adicionei o método 'getId()' que estava faltando.
  // Ele segue o mesmo padrão dos outros, usando o 'getDecodedToken()'
  // para pegar o token decodificado e retornar a propriedade 'id'.
  getId(): number | null {
    const decoded = this.getDecodedToken();
    // Assumindo que a propriedade do ID no seu token se chama 'id'.
    return decoded ? decoded.id : null;
  }

  // ==================== ALTERAÇÃO 2 ====================
  // Adicionei o método 'logout()' que também era necessário.
  // A única responsabilidade dele é remover o token do localStorage,
  // efetivamente "deslogando" o usuário no front-end.
  logout(): void {
    localStorage.removeItem('token');
  }
}
