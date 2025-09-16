import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // verifica expiração do token
    const token = this.loginService.getToken();
    if (token && this.loginService.isTokenExpired()) {
      this.loginService.deleteToken();
      this.router.navigate(['/login']); // redireciona para login
      return throwError(() => new Error('Token expirado'));
    }

    // clona a requisição e adiciona header Authorization
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // Captura erros de autenticação do backend
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.loginService.deleteToken();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
