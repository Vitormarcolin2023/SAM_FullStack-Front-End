import { Component, OnInit, inject } from '@angular/core'; // Adicione 'inject'
import { Router, RouterLink } from '@angular/router'; // Adicione 'Router'
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
    const userEmail = this.tokenService.getEmail();

    if (userEmail) {
      this.carregarPerfil(userEmail);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Sessão Inválida',
        text: 'Não foi possível encontrar seu e-mail. Por favor, faça o login novamente.',
      });
      this.router.navigate(['/login']);
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
        Swal.fire({
          icon: 'error',
          title: 'Erro ao Carregar Perfil',
          text: 'Não foi possível encontrar seus dados. Tente novamente mais tarde.',
        });
        this.isLoading = false;
        this.router.navigate(['/tela-inicial']);
      },
    });
  }
}
