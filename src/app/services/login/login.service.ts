import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../../models/login/login-dto';
import { Mentor } from '../../models/mentor/mentor';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/auth';
  // URL base para os endpoints de mentor
  private mentorApiUrl = 'http://localhost:8080/mentores';
  http = inject(HttpClient);

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/login`, loginDto);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  }

  deleteToken() {
    localStorage.removeItem('token');
    localStorage.clear();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true; // token inválido
    }
  }

  getMentorProfile(): Observable<Mentor> {
    const token = this.getToken();

    // Configura o cabeçalho de autorização com o token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Usa a URL correta para os mentores
    return this.http.get<Mentor>(`${this.mentorApiUrl}/me`, { headers });
  }
}
