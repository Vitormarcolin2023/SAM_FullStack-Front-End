import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router'; // Verifique se o Router está importado
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import Swal from 'sweetalert2';

import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import { TokenDecode } from '../../../../models/token/token-decode';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './aluno-perfil.component.html',
  styleUrls: ['./aluno-perfil.component.scss'], // Caminho para o NOVO SCSS
})
export class AlunoPerfilComponent implements OnInit {
  aluno: Aluno | null = null;
  isLoading = true;

  private alunoService = inject(AlunoService);
  private tokenService = inject(TokenDecode);
  private router = inject(Router); // O router já estava injetado

  ngOnInit(): void {
    const userEmail = this.tokenService.getEmail();

    if (userEmail) {
      this.carregarPerfil(userEmail);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Sessão Inválida',
        text: 'Não foi possível encontrar seu e-mail. Por favor, faça o login novamente.',
        confirmButtonText: 'Ir para Login',
        confirmButtonColor: 'rgb(28, 232, 151)', // Use sua variável $btn-acao
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  carregarPerfil(email: string): void {
    this.isLoading = true;
    this.alunoService.getAlunoPorEmail(email).subscribe({
      next: (dados) => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar perfil do aluno:', err);
        this.isLoading = false; // Garante que o loading pare no erro

        Swal.fire({
          icon: 'error',
          title: 'Erro ao Carregar Perfil',
          text: 'Não foi possível encontrar seus dados. Tente novamente mais tarde.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: 'rgb(28, 232, 151)',
          showCancelButton: true,
          cancelButtonText: 'Voltar ao Início',
          cancelButtonColor: '#a3a3a3ff',
          reverseButtons: true,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigate(['/tela-inicial']);
          }
        });
      },
    });
  }

  /**
   * 🚀 FUNÇÃO ADICIONADA
   * Navega para a tela de edição de perfil.
   */
  editarPerfil(): void {
    if (this.aluno?.email) {
      // Rota baseada na que você me mostrou em conversas anteriores
      this.router.navigate(['/aluno/aluno-editar', this.aluno.email]);
    } else {
      Swal.fire('Erro', 'Não foi possível encontrar o e-mail do aluno para edição.', 'error');
    }
  }
}