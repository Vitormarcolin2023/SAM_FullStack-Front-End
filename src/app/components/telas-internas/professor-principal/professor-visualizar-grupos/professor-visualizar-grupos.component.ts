import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Grupo } from '../../../../models/grupo/grupo';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { ProfessorService } from '../../../../services/professor/professor.service';

@Component({
  selector: 'app-professor-visualizar-grupos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professor-visualizar-grupos.component.html',
  styleUrls: ['./professor-visualizar-grupos.component.scss'],
})
export class ProfessorVisualizarGruposComponent implements OnInit {
  // Variáveis para guardar os grupos
  gruposCompletos: Grupo[] = []; // Guarda a lista original
  gruposFiltrados: Grupo[] = []; // Lista para exibir na tela
  isLoading = true;

  // Injeção dos serviços
  private grupoService = inject(GrupoService);
  private professorService = inject(ProfessorService);
  private router = inject(Router);

  ngOnInit(): void {
    this.carregarProfessorEGrupos();
  }

  carregarProfessorEGrupos(): void {
    this.isLoading = true;

    // 1. Obter o perfil do professor logado
    // (Estou assumindo que você tenha um método 'getMyProfile' no ProfessorService,
    // similar ao que existe no AlunoService)
    this.professorService.getMyProfile().subscribe({
      next: (professor) => {
        if (!professor || !professor.id) {
          Swal.fire({
            icon: 'error',
            title: 'Erro de Autenticação',
            text: 'Não foi possível identificar o professor logado.',
            confirmButtonColor: 'rgb(255, 0, 0)',
          });
          this.isLoading = false;
          return;
        }

        // 2. Buscar os grupos associados a esse professor
        // (Estou assumindo que você criará este método no seu GrupoService,
        // que busca grupos pelo ID do professor)
        this.grupoService.findGruposByProfessorId(professor.id).subscribe({
          next: (grupos) => {
            this.gruposCompletos = grupos;
            this.gruposFiltrados = this.gruposCompletos; // Sem filtro, a lista é a mesma
            this.isLoading = false;
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Falha ao Carregar Grupos',
              text: 'Não foi possível buscar os grupos associados a você.',
              confirmButtonColor: 'rgb(255, 0, 0)',
            });
            console.error('Erro ao buscar grupos por professor:', err);
            this.isLoading = false;
            this.gruposFiltrados = []; // Garante que a mensagem de "vazio" apareça
          },
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro de Autenticação',
          text: 'Falha ao obter o perfil do professor. Faça login novamente.',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        console.error('Erro ao obter perfil do professor:', err);
        this.isLoading = false;
      },
    });
  }

  // Função para ver detalhes do grupo (se necessário)
  verDetalhesGrupo(id: number | undefined): void {
    if (!id) return;

    // Você pode navegar para uma rota de detalhes do grupo específica para professor
    // this.router.navigate(['/professor/grupo-details', id]);

    Swal.fire({
      title: 'VEM AÍ!',
      text: `A funcionalidade de ver os detalhes do grupo (${id}) ainda será implementada.`,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: 'rgb(28, 232, 151)',
    });
  }
}