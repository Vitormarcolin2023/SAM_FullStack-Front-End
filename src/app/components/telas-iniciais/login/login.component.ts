import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';

import { LoginDto } from '../../../models/login/login-dto';
import { NavbarComponent } from '../../design/navbar/navbar.component';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MdbFormsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: LoginDto = {
    email: '',
    senha: '',
    role: '',
  };

  isLoading = false;

  loginService = inject(LoginService);
  router = inject(Router);

  constructor() {
    this.loginService.deleteToken();
  }

  logar() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.loginService.login(this.login).subscribe({
      next: (response) => {
        const token = response.token;
        this.loginService.setToken(token);

        localStorage.setItem('role', response.role ?? '');
        localStorage.setItem('emailLogado', response.email ?? '');
        localStorage.setItem('mentorStatus', response.status ?? '');

        const role = (response.role ?? '').toUpperCase();
        const status = (response.status ?? '').toUpperCase();

        console.log('Valor da role:', role);
        console.log('Valor do status:', status);

        switch (role) {
          case 'MENTOR':
            if (status === 'ATIVO') {
              this.router.navigate(['mentor-perfil']);
            } else if (status === 'PENDENTE') {
              Swal.fire({
                icon: 'info',
                title: 'Perfil em Análise',
                text: 'Sua solicitação para ser mentor está em análise. Você será notificado quando a coordenação concluir o processo.',
                confirmButtonColor: '#4CAF50',
              });
            } else if (status === 'INATIVO') {
              Swal.fire({
                icon: 'warning',
                title: 'Perfil Inativo',
                text: 'Seu perfil de mentor está inativo. Por favor, entre em contato com a instituição de ensino para mais detalhes.',
                confirmButtonColor: '#f44336',
              });
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'Erro no Status',
                text: 'O status do seu perfil de mentor é inválido. Por favor, entre em contato com a instituição de ensino para mais detalhes.',
                confirmButtonColor: '#f44336',
              });
            }
            break;
          case 'ALUNO':
            this.router.navigate(['/aluno/aluno-bem-vindo']);
            break;
          case 'COORDENADOR':
            this.router.navigate(['funcionario-perfil']);
            break;
          case 'PROFESSOR':
            this.router.navigate(['funcionario-perfil']);
            break;
        }
        this.isLoading = false;
      },
      error: (erro) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao logar',
          text: erro.error,
        });
        this.isLoading = false;
        this.login = { email: '', senha: '', role: '' };
        this.loginService.deleteToken();
      },
    });
  }
}
