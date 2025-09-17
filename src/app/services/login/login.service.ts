import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../../models/login-dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/auth';
  http = inject(HttpClient);

  login(loginDto: LoginDto): Observable<any>{
    return this.http.post<string>(`${this.apiUrl}/login`, loginDto)
  }

  setToken(token: string){
    localStorage.setItem('token', JSON.stringify(token));
  }

  getToken(): string | null {
    const token = localStorage.getItem('token'); 
    return token ? JSON.parse(token) : null;      
  }

  deleteToken(){
    localStorage.removeItem('token');
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

}
