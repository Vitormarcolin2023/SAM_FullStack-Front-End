import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

import { Mentor } from '../../../../models/mentor/mentor';
import { MentorService } from '../../../../services/mentores/mentores.service';

@Component({
  selector: 'app-aluno-visualizar-mentor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './aluno-visualizar-mentor.component.html',
  styleUrl: './aluno-visualizar-mentor.component.scss',
})
export class AlunoVisualizarMentorComponent implements OnInit {
  // 3. NOVAS VARIÁVEIS
  mentoresCompletos: Mentor[] = []; // Guarda a lista original
  mentoresFiltrados: Mentor[] = []; // Lista para exibir na tela
  termoBusca: string = ''; // Ligado ao input com [(ngModel)]
  isLoading = true;

  private mentorService = inject(MentorService);
  private router = inject(Router);

  ngOnInit(): void {
    this.carregarMentores();
  }

  carregarMentores(): void {
    this.isLoading = true;
    this.mentorService.listAll().subscribe({
      next: (dados) => {
        // Guarda a lista original
        this.mentoresCompletos = dados.filter(
          (m) => m.statusMentor === 'ATIVO'
        );
        // Inicializa a lista filtrada
        this.mentoresFiltrados = this.mentoresCompletos;
        this.isLoading = false;
      },
      error: (err) => {
        // ... seu código de erro ...
        this.isLoading = false;
      },
    });
  }

  // 4. FUNÇÃO DE FILTRO
  filtrarMentores(): void {
    const termo = this.termoBusca.toLowerCase().trim();

    if (!termo) {
      this.mentoresFiltrados = this.mentoresCompletos;
      return;
    }

    this.mentoresFiltrados = this.mentoresCompletos.filter((mentor) => {
      const nome = mentor.nome.toLowerCase();
      const area = mentor.areaDeAtuacao?.nome?.toLowerCase() || '';

      return nome.includes(termo) || area.includes(termo);
    });
  }

  // 5. FUNÇÃO PARA VER PERFIL
  verPerfil(id: number | undefined): void {
    if (!id) return;

    // precisa criar esta rota
    // this.router.navigate(['/aluno/mentor-perfil', id]);

    Swal.fire({
      title: 'VEM AÍ!',
      text: `A funcionalidade de ver o perfil detalhado do mentor ainda será implementada.`,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: 'rgb(28, 232, 151)',
    });
  }
}
