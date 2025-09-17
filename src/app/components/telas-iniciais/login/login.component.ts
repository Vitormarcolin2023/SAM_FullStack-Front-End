import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { LoginService } from '../../../services/login.service';
import { LoginDto } from '../../../models/login/login-dto';
import { NavbarComponent } from '../../design/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,        // necessário para ngModel
    CommonModule,       // básico do Angular
    MdbFormsModule,     // necessário para mdb-form-control
    NavbarComponent     // necessário para app-navbar
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  login: LoginDto = {
    email: '',
    senha: '',
    role: ''
  };

  loginService = inject(LoginService);
  router = inject(Router);

  logar() {
    const btnLogar = document.getElementById("btn-logar") as HTMLButtonElement | null;
    if (btnLogar) btnLogar.disabled = true;

    this.loginService.login(this.login).subscribe({
      next: response => {
        const token = response.token;
        this.loginService.setToken(token);

        // salva role e email no localStorage
        localStorage.setItem('role', this.login.role ?? '');
        localStorage.setItem('emailLogado', this.login.email ?? '');

        // redireciona conforme o role
        if ((this.login.role ?? '').toUpperCase() === 'MENTOR') {
          this.router.navigate(['mentor-perfil']);
        } else {
          this.router.navigate(['tela-inicial']);
        }

        if (btnLogar) btnLogar.disabled = false;
      },
      error: erro => {
        alert(erro.error?.token ?? erro.error?.message ?? 'Erro ao logar');

        if (btnLogar) btnLogar.disabled = false;
        this.login = { email: '', senha: '', role: '' };
        this.loginService.deleteToken();
      }
    });
  }
}
