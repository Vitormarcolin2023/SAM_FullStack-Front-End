import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';
import { LoginDto } from '../../../models/login/login-dto';
import { NavbarComponent } from '../../design/navbar/navbar.component';
import { LoginService } from '../../../services/login/login.service';
import { AlunoService } from '../../../services/alunos/alunos.service';
import { Aluno } from '../../../models/aluno/aluno';
import { ProjetoService } from '../../../services/projeto/projeto.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MdbFormsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: LoginDto = { email: '', senha: '', role: '' };
  isLoading = false;
  isAvaliacaoPendente = false;

  loginService = inject(LoginService);
  router = inject(Router);

  alunoService = inject(AlunoService);
  projetoService = inject(ProjetoService);

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
        this.loginService.setToken(response.token);
        const role = (response.role ?? '').toUpperCase();

        if (role === 'ALUNO') {
          this.alunoService.autenticarAluno(response.email).subscribe({
            next: (res) => {
              if (res.id) {
                this.verificavaliacao(res.id);
              }
              this.isLoading = false;
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar dados do aluno',
                text: err.error,
              });
              this.isLoading = false;
            },
          });
        } else {
          this.handleRoleNavigation(role, response.status);
          this.isLoading = false;
        }
      },
      error: (erro) => {
        Swal.fire({ icon: 'error', title: 'Erro ao logar', text: erro.error });
        this.isLoading = false;
        this.login = { email: '', senha: '', role: '' };
        this.loginService.deleteToken();
      },
    });
  }

  handleRoleNavigation(role: string, status: string | null): void {
    const safeStatus = (status ?? '').toUpperCase();
    console.log('Valor da role:', role);
    console.log('Valor do status:', safeStatus);

    switch (role) {
      case 'MENTOR':
        if (safeStatus === 'ATIVO') {
          this.router.navigate(['/aprovar-mentoria/painel-de-mentorias']);
        } else if (safeStatus === 'PENDENTE') {
          Swal.fire({
            icon: 'info',
            title: 'Perfil em Análise',
            text: 'Sua solicitação para ser mentor está em análise.',
          });
        } else if (safeStatus === 'INATIVO') {
          Swal.fire({
            icon: 'warning',
            title: 'Perfil Inativo',
            text: 'Seu perfil de mentor está inativo.',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Erro no Status',
            text: 'O status do seu perfil é inválido.',
          });
        }
        break;
      case 'COORDENADOR':
      case 'PROFESSOR':
        this.router.navigate(['funcionario-perfil']);
        break;
    }
  }

  verificavaliacao(alunoId: number) {
  this.projetoService
    .buscarProjetoAguardandoAvaliacaoAluno(alunoId)
    .subscribe({
      next: (res) => {
        this.isAvaliacaoPendente = true;
        this.router.navigate(['/avaliacao/alunos-mentores']);
        console.log("tem avaliação pendente");
      },
      error: (err) => {
        this.isAvaliacaoPendente = false;
        this.router.navigate(['/visual-projeto']);
        console.log("não tem avaliação pendente");
      },
    });
}

}
