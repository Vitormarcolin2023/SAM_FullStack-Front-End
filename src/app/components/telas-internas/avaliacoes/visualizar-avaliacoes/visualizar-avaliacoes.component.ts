import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvaliacaoService } from '../../../../services/avaliacao/avaliacao.service';
import { Coordenador } from '../../../../models/coordenacao/coordenador';
import { CoordenadorService } from '../../../../services/coordenacao/coordenador.service';
import Swal from 'sweetalert2';
import { TokenDecode } from '../../../../models/token/token-decode';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import { Avaliacao, avaliacaoDTO } from '../../../../models/avaliacao/avaliacao';
import { AvaliacaoDetailsComponent } from "../avaliacao-details/avaliacao-details.component";

@Component({
  selector: 'app-visualizar-avaliacoes',
  imports: [CommonModule, FormsModule, SidebarComponent, AvaliacaoDetailsComponent],
  templateUrl: './visualizar-avaliacoes.component.html',
  styleUrl: './visualizar-avaliacoes.component.scss',
})
export class VisualizarAvaliacoesComponent {
  isLoading = true;

  coordenadorLogado!: Coordenador;
  avaliacoes: avaliacaoDTO[] = [];
  avaliacoesFiltradas: avaliacaoDTO[] = [];

  semestreSelecionado: string = '';
  semestres: string[] = [
    "1º Semestre",
    "2º Semestre",
    "3º Semestre",
    "4º Semestre",
    "5º Semestre",
    "6º Semestre",
    "7º Semestre",
    "8º Semestre",
    "9º Semestre",
    "10º Semestre"
  ];

  avaliacaoSelecionada: Avaliacao | undefined;

  tokenDecode = inject(TokenDecode);
  avaliacaoService = inject(AvaliacaoService);
  coordenadorService = inject(CoordenadorService);

  //constructor(private avaliacaoService: AvaliacaoService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.coordenadorService.getMyProfile().subscribe({
      next: (coordenador) => {
        this.coordenadorLogado = coordenador;
        this.carregarAvaliacoes(coordenador);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar coordenador logado',
          confirmButtonColor: 'rgb(255,0,0)',
        });
      },
    });
  }

  carregarAvaliacoes(coordenador: Coordenador) {
    const areasDeAtuacao = coordenador.cursos.map((c) => c.areaDeAtuacao.id);

    this.avaliacaoService.buscarAvaliacoesAreaDeAtuacao(areasDeAtuacao).subscribe({
      next: res => {
        this.avaliacoes = res;
        this.filtrarPorSemestre();
        console.log(res);
        this.isLoading = false;
      }, error: err  => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Nenhuma avaliação disponível',
          confirmButtonColor: 'rgb(255,0,0)',
        });
      }
    });
  }

  filtrarPorSemestre() {
    if (!this.semestreSelecionado) {
      this.avaliacoesFiltradas = this.avaliacoes;
      return;
    }

    this.avaliacoesFiltradas = this.avaliacoes.filter(
      (a) => a.projeto.periodo === this.semestreSelecionado
    );
  }

  getClasseNota(nota: number): string {
  if (nota <= 2) return 'nota-vermelha';
  if (nota >= 3 && nota < 4) return 'nota-laranja';
  if (nota >= 4 && nota <= 4.5) return 'nota-amarela';
  if (nota > 4.5) return 'nota-verde';
  return '';
}


  visualizarAvaliacao(av: Avaliacao) {
    this.avaliacaoSelecionada = av;
  }

  voltar() {
    history.back();
  }
}
