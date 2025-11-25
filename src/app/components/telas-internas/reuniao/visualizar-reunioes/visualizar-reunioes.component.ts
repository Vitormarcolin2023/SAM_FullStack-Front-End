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
import { ReuniaoDetailsComponent } from "../reuniao-details/reuniao-details.component";

@Component({
  selector: 'app-visualizar-reunioes',
  imports: [CommonModule, FormsModule, ReuniaoDetailsComponent],
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
    } else if (this.role == 'MENTOR') {
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

  carregarProjetoMentor() {
    this.mentorService.getMyProfile().subscribe({
      next: (mentor) => {
        if (mentor.id) {
          this.projetoService.buscarProjetosAtivos(mentor.id).subscribe({
            next: (projetos) => {
              this.projetos = projetos;
              this.projeto = projetos[0];
              this.filtrarPorProjeto(projetos[0]);
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Mentor não possui projeto ativo',
                confirmButtonColor: 'rgb(255, 0, 0)',
              });
            },
          });
          this.isLoading = false;
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar mentor logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        this.isLoading = false;
      },
    });
  }

  filtrarPorStatus() {
    this.reunioesFiltradas = this.reunioes.filter(
      (r) => r.statusReuniao === this.statusSelecionado
    );
  }

  filtrarPorProjeto(projeto: Projeto) {
    if (projeto && projeto.id) {
      this.reuniaoService.buscarReunioesPorProjeto(projeto.id).subscribe({
        next: (reunioes) => {
          this.reunioes = reunioes;
          this.filtrarPorStatus();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Algo deu errado.',
            text: 'Por favor, tente novamente mais tarde',
            confirmButtonColor: 'rgb(255, 0, 0)',
          });
        },
      });
    }
  }

  editarReuniao() {
    this.router.navigate(['/reunioes/editar']);
  }

  aceitarReuniao(reuniaoId: number) {
    const motivo = '';

    this.reuniaoService.aceitarReuniao(reuniaoId, 'ACEITO', motivo).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Reunião aceita com sucesso!',
          confirmButtonColor: 'rgb(0, 153, 94)',
        }).then(() => {
          location.reload();
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Algo deu errado.',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
      },
    });
  }

  recusarReuniao(reuniaoId: number) {
    Swal.fire({
      title: 'Motivo do cancelamento',
      html: `
          <p style="font-size: 18px;">Escreva o motivo pelo qual a solicitação de reunião foi recusada.</p>
          <textarea id="swal-resumo" class="swal2-textarea" style="resize: none; width: 80%;"
            placeholder="Escreva aqui o motivo pelo qual a solicitação de reunião foi recusada">
          </textarea>
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const motivo = (
          document.getElementById('swal-resumo') as HTMLTextAreaElement
        )?.value.trim();
        return { motivo };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.reuniaoService
          .aceitarReuniao(reuniaoId, 'RECUSADO', result.value.motivo)
          .subscribe({
            next: (result) => {
              Swal.fire(
                'Recusado!',
                'A solicitação de reunião foi recusada com sucesso.',
                'success'
              ).then(() => {
                location.reload();
              });
            },
            error: (erro: any) => {
              Swal.fire(
                'Erro',
                erro?.error?.message || 'Erro ao atualizar',
                'error'
              );
            },
          });
      }
    });
  }

  reuniaoSelecionada?: Reuniao;
  modalLoading: boolean = false;

  visualizarReuniao(reuniao: Reuniao) {
    this.reuniaoSelecionada = { ...reuniao }; // clona para não alterar direto
  }

  atualizarReuniao(reuniaoEditada: Reuniao) {
    // chama o serviço para salvar alterações no backend
    this.reuniaoService.updateReuniao(reuniaoEditada.id!, reuniaoEditada).subscribe({
      next: (res) => {
        // atualiza na lista
        const index = this.reunioes.findIndex(
          (r) => r.id === reuniaoEditada.id
        );
        if (index !== -1) this.reunioes[index] = reuniaoEditada;
        this.reuniaoSelecionada = undefined;
        Swal.fire(
                'Atualizado!',
                'A reunião foi atualizada com sucesso',
                'success'
              ).then(() => {
                location.reload();
              });
      }, error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Algo deu errado.',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
      }
      
    });
  }

  voltar() {
    history.back();
  }
}
