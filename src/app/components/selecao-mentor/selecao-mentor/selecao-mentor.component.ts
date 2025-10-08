import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mentor } from '../../../models/mentor/mentor';
import { MentorService } from '../../../services/mentores/mentores.service';
import { SelecaoService } from '../../../services/selecao/selecao.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selecao-mentor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selecao-mentor.component.html',
  styleUrls: ['./selecao-mentor.component.scss'],
})
export class SelecaoMentorComponent implements OnInit {
  mentores: Mentor[] = [];
  isLoading = true;
  idArea: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mentorService: MentorService,
    private selecaoService: SelecaoService
  ) {}

  ngOnInit(): void {
    // 1. Pega o ID da área de atuação passado pela URL
    this.idArea = +this.route.snapshot.params['idArea'];

    if (this.idArea) {
      // 2. Busca os mentores filtrados por essa área e que estão ATIVOS
      this.mentorService.findByAreaDeAtuacao(this.idArea).subscribe({
        next: (data) => {
          this.mentores = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar mentores:', err);
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * Chamado ao clicar no botão "Escolher este mentor".
   * @param mentor O objeto do mentor que foi escolhido.
   */
  escolherMentor(mentor: Mentor): void {
    // 3. Usa o serviço de seleção para "enviar" o mentor escolhido
    this.selecaoService.setMentor(mentor);
    // 4. Navega de volta para a tela de criação de projeto
    this.router.navigate(['/criar-projeto']);
  }

  voltar(): void {
    // Navega de volta sem selecionar ninguém
    this.router.navigate(['/criar-projeto']);
  }
}
