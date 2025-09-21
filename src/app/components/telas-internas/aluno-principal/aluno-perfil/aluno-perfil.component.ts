import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import { TokenDecode } from '../../../../models/token/token-decode';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aluno-perfil.component.html',
  styleUrls: ['./aluno-perfil.component.scss'],
})
export class AlunoPerfilComponent implements OnInit {
  aluno: Aluno | null = null;
  isLoading = true;

  private alunoService = inject(AlunoService);
  private tokenService = inject(TokenDecode);
  private router = inject(Router);

  ngOnInit(): void {
    // 1. MANTIVEMOS A LÓGICA DA OPÇÃO 1: buscar o e-mail automaticamente do token.
    const userEmail = this.tokenService.getEmail();

    if (userEmail) {
      this.carregarPerfil(userEmail);
    } else {
      // 2. APLICAMOS O DESIGN DA OPÇÃO 2: no alerta de erro de sessão.
      Swal.fire({
        icon: 'error',
        title: 'Sessão Inválida',
        text: 'Não foi possível encontrar seu e-mail. Por favor, faça o login novamente.',
        confirmButtonText: 'Ir para Login',
        confirmButtonColor: 'rgb(28, 232, 151)', // Cor do botão da Opção 2
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  carregarPerfil(email: string): void {
    this.isLoading = true;
    this.alunoService.getAlunoPorEmail(email).subscribe({
      next: (dados) => {
        this.aluno = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar perfil do aluno:', err);
        // 3. APLICAMOS O DESIGN DA OPÇÃO 2: no alerta de erro ao carregar o perfil.
        Swal.fire({
          icon: 'error',
          title: 'Erro ao Carregar Perfil',
          text: 'Não foi possível encontrar seus dados. Tente novamente mais tarde.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: 'rgb(28, 232, 151)', // Cor do botão da Opção 2
          showCancelButton: true,
          cancelButtonText: 'Voltar ao Início',
          cancelButtonColor: '#a3a3a3ff', // Cor do botão de cancelar da Opção 2
          reverseButtons: true, // Ordem dos botões da Opção 2
        }).then((result) => {
          // Se o usuário clicar em "Voltar ao Início", nós o redirecionamos.
          if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigate(['/tela-inicial']);
          }
        });
        this.isLoading = false;
      },
    });
  }

  // A função abrirModalEmail() foi removida pois não é mais necessária.
}