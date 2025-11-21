import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2';
import { Grupo } from '../../../../models/grupo/grupo';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { ProfessorService } from '../../../../services/professor/professor.service';


@Component({
  selector: 'app-professor-visualizar-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professor-visualizar-grupos.component.html',
  styleUrls: ['./professor-visualizar-grupos.component.scss'],
})
export class ProfessorVisualizarGruposComponent implements OnInit {
  
  // Dados
  gruposCompletos: Grupo[] = []; // Cópia de segurança com todos os dados
  gruposFiltrados: Grupo[] = []; // Lista que é exibida na tela
  
  isLoading = true;

  // --- LÓGICA DO FILTRO ---
  // Lista fixa do 1º ao 10º Período
  periodosDisponiveis: string[] = [
    '1º Período', '2º Período', '3º Período', '4º Período', '5º Período',
    '6º Período', '7º Período', '8º Período', '9º Período', '10º Período'
  ];
  
  periodoSelecionado: string = ''; // Vazio representa "Todos"

  // Injeção de dependências
  private grupoService = inject(GrupoService);
  private professorService = inject(ProfessorService);
  private router = inject(Router);

  ngOnInit(): void {
    this.carregarProfessorEGrupos();
  }

  carregarProfessorEGrupos(): void {
    this.isLoading = true;

    this.professorService.getMyProfile().subscribe({
      next: (professor) => {
        if (!professor || !professor.id) {
          this.mostrarErro('Erro de Autenticação', 'Não foi possível identificar o professor logado.');
          return;
        }

        this.grupoService.findGruposByProfessorId(professor.id).subscribe({
          next: (grupos) => {
            this.gruposCompletos = grupos;
            
            // Aplica o filtro inicial (que mostrará todos se periodoSelecionado for vazio)
            this.filtrarPorPeriodo(); 
            
            this.isLoading = false;
          },
          error: (err) => {
            this.mostrarErro('Falha ao Carregar Grupos', 'Não foi possível buscar os grupos associados a você.');
            console.error(err);
            this.isLoading = false;
            this.gruposFiltrados = [];
          },
        });
      },
      error: (err) => {
        this.mostrarErro('Erro de Autenticação', 'Falha ao obter o perfil do professor.');
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // Função acionada sempre que o usuário muda o dropdown
  filtrarPorPeriodo(): void {
    if (!this.periodoSelecionado || this.periodoSelecionado === '') {
      // Se "Todos" estiver selecionado, restaura a lista completa
      this.gruposFiltrados = this.gruposCompletos;
    } else {
      // Filtra apenas os grupos que correspondem exatamente ao período
      this.gruposFiltrados = this.gruposCompletos.filter(
        grupo => grupo.periodo === this.periodoSelecionado
      );
    }
  }

  verDetalhesGrupo(id: number | undefined): void {
    if (!id) return;
    // Exemplo de navegação futura
    // this.router.navigate(['/professor/detalhes-grupo', id]);
    
    Swal.fire({
      title: 'VEM AÍ!',
      text: `Detalhes do grupo ID: ${id}`,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: 'rgb(28, 232, 151)',
    });
  }

  private mostrarErro(titulo: string, texto: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: texto,
      confirmButtonColor: 'rgb(255, 0, 0)',
    });
    this.isLoading = false;
  }
}