import { Component, inject } from '@angular/core';
import { Reuniao } from '../../../../models/reuniao/reuniao';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReuniaoService } from '../../../../services/reuniao/reuniao.service';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import { MentorService } from '../../../../services/mentores/mentores.service';
import { Projeto } from '../../../../models/projeto/projeto';
import { ProjetoService } from '../../../../services/projeto/projeto.service';
import { TokenDecode } from '../../../../models/token/token-decode';
import Swal from 'sweetalert2';
import { GrupoService } from '../../../../services/grupo/grupo.service';

@Component({
  selector: 'app-visualizar-reunioes',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-reunioes.component.html',
  styleUrls: ['./visualizar-reunioes.component.scss'],
})
export class VisualizarReunioesComponent {
  role: any;

  statusSelecionado = 'PENDENTE';
  reunioes: Reuniao[] = [];
  reunioesFiltradas: Reuniao[] = [];
  isLoading = true;
  projeto!: Projeto;
  projetos!: Projeto[];

  reuniaoService = inject(ReuniaoService);
  alunoService = inject(AlunoService);
  projetoService = inject(ProjetoService);
  mentorService = inject(MentorService);
  tokenDecode = inject(TokenDecode);
  router = inject(Router);

  ngOnInit() {
    this.role = this.tokenDecode.getRole();
    this.carregar();
  }

  carregar() {
    if (this.role == 'ALUNO') {
      this.carregarProjetoAluno();
    } else if(this.role == 'MENTOR'){
      this.carregarProjetoMentor();
    }
  }

  carregarProjetoAluno() {
    this.alunoService.getMyProfile().subscribe({
      next: (aluno) => {
        if (aluno.id) {
          this.projetoService.buscarProjetoAtivo(aluno.id).subscribe({
            next: (projeto) => {
              this.projeto = projeto;
              this.filtrarPorProjeto(projeto);
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Aluno não possui projeto ativo',
                confirmButtonColor: 'rgb(255, 0, 0)',
              });
            },
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar aluno logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        this.isLoading = false;
      },
    });
  }

  carregarProjetoMentor(){
    this.mentorService.getMyProfile().subscribe({
      next: mentor => {
        if(mentor.id){
          this.projetoService.buscarProjetosAtivos(mentor.id).subscribe({
            next: projetos => {
              this.projetos = projetos;
              this.projeto = projetos[0];
              this.filtrarPorProjeto(projetos[0]);
            }, error: err => {
               Swal.fire({
                icon: 'error',
                title: 'Mentor não possui projeto ativo',
                confirmButtonColor: 'rgb(255, 0, 0)',
              });
            }
          })
          this.isLoading = false;
        }
      }, error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar mentor logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        this.isLoading = false;
      }
    });
  }

filtrarPorStatus() {
  this.reunioesFiltradas = this.reunioes
    .filter(r => r.statusReuniao === this.statusSelecionado)
    // opcional: se quiser filtrar pelo projeto selecionado também
    .filter(r => !this.projeto || r.projeto?.id === this.projeto.id);
}

  filtrarPorProjeto(projeto: Projeto){
    if(projeto && projeto.id){
      this.reuniaoService.buscarReunioesPorProjeto(projeto.id).subscribe({
        next: reunioes => {
          this.reunioesFiltradas = reunioes;
          console.log(reunioes);
        }, error: err => {
          Swal.fire({
          icon: 'error',
          title: 'Algo deu errado.',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        }
      })
    }
  }

  visualizarReuniao() {
    this.router.navigate(['/reunioes/visualizar']);
  }

  editarReuniao() {
    this.router.navigate(['/reunioes/editar']);
  }

  voltar() {}
}
