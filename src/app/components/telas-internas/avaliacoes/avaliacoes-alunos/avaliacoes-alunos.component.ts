import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Projeto } from '../../../../models/projeto/projeto';
import { ProjetoService } from '../../../../services/projeto/projeto.service';
import { TokenDecode } from '../../../../models/token/token-decode';
import { MentorService } from '../../../../services/mentores/mentores.service';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Aluno } from '../../../../models/aluno/aluno';
import { Coordenador } from '../../../../models/coordenacao/coordenador';
import { Avaliacao } from '../../../../models/avaliacao/avaliacao';
import { AvaliacaoService } from '../../../../services/avaliacao/avaliacao.service';
import { Mentor } from '../../../../models/mentor/mentor';

@Component({
  selector: 'app-avaliacoes-alunos',
  imports: [FormsModule, CommonModule],
  templateUrl: './avaliacoes-alunos.component.html',
  styleUrl: './avaliacoes-alunos.component.scss',
})
export class AvaliacoesAlunosComponent {
  isLoading = true;
  avaliacaoEnviada = false;
  avaliacaoTentada = false;
  router = inject(Router);

  role: any;
  tokenDecode = inject(TokenDecode);
  cdr = inject(ChangeDetectorRef); // Adicionado ChangeDetectorRef

  projetosMentor: Projeto[] = [];
  projeto!: Projeto;
  alunos: Aluno[] = [];
  coordenador!: Coordenador;
  alunoLogado!: Aluno;

  projetoService = inject(ProjetoService);
  mentorService = inject(MentorService);
  alunoService = inject(AlunoService);
  avaliacaoService = inject(AvaliacaoService);

  perguntas = [
    {
      id: 1,
      texto:
        'O meu mentor demonstrou experiência relevante em soluções de problemas.',
    },
    {
      id: 2,
      texto:
        'O mentor forneceu feedback claro e construtivo, que contribuiu diretamente para o meu desenvolvimento e aprendizado.',
    },
    {
      id: 3,
      texto:
        'As sessões de mentoria tiveram foco e foram adequadas para me ajudar a progredir em direção aos objetivos estabelecidos no PIE.',
    },
    {
      id: 4,
      texto:
        'O mentor se mostrou disponível para demandas pontuais e/ou agenda de reuniões regulares do PIE.',
    },
    {
      id: 5,
      texto:
        'Eu considero a experiência de mentoria exitosa no que se refere à solução desenvolvida para o projeto integrador!',
    },
    {
      id: 6,
      texto:
        'Eu considero a troca de experiências na mentoria exitosa para o desenvolvimento profissional e pessoal.',
    },
  ];

  opcoes = [
    { valor: 1, label: 'Discordo Totalmente' },
    { valor: 2, label: 'Discordo Parcialmente' },
    { valor: 3, label: 'Neutro' },
    { valor: 4, label: 'Concordo Parcialmente' },
    { valor: 5, label: 'Concordo Totalmente' },
  ];

  opcoesMentor = [
    { valor: 1, label: 'Totalmente Insatisfeito(a)' },
    { valor: 2, label: 'Insatisfeito(a)' },
    { valor: 3, label: 'Neutro' },
    { valor: 4, label: 'Satisfeito(a)' },
    { valor: 5, label: 'Totalmente Satisfeito(a)' },
  ];

  respostas: { [key: number]: number } = {};
  comentarios = '';
  recomendacao!: boolean;

  notaMentor!: number;
  comentarioMentor = '';
  destinoComentario = 'TODOS';
  alunosProjeto: any[] = [];

  ngOnInit() {
    this.role = this.tokenDecode.getRole();
    this.carregarDados();
  }

  carregarDados() {
    if (this.role === 'ALUNO') {
      this.carregarProjetoAluno();
    } else if (this.role === 'MENTOR') {
      this.carregarProjetoMentor();
    } else {
      this.isLoading = false;
    }
  }

  carregarProjetoAluno() {
    this.alunoService.getMyProfile().subscribe({
      next: (aluno) => {
        this.alunoLogado = aluno;
        if (aluno.id) {
          this.projetoService
            .buscarProjetoAguardandoAvaliacaoAluno(aluno.id)
            .subscribe({
              next: (projeto) => {
                this.projeto = projeto;
                this.filtrarPorProjeto(projeto);
                this.cdr.detectChanges(); // Força a atualização do template
                this.isLoading = false;
              },
              error: () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Aluno não possui projeto a ser avaliado',
                  confirmButtonColor: 'rgb(255,0,0)',
                }).then(() => {
                  this.router.navigate(['/visual-projeto']);
                });
                this.isLoading = false;
              },
            });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar aluno logado',
          confirmButtonColor: 'rgb(255,0,0)',
        });
        this.isLoading = false;
      },
    });
  }

  carregarProjetoMentor() {
    this.mentorService.getMyProfile().subscribe({
      next: (mentor) => {
        if (mentor.id) {
          this.projetoService
            .buscarProjetosAguardandoAvaliacaoMentor(mentor.id)
            .subscribe({
              next: (projetos) => {
                this.projetosMentor = projetos;
                if (projetos && projetos.length > 0) {
                  setTimeout(() => {
                    this.projeto = projetos[0]; // força atualização de referência
                    this.filtrarPorProjeto(projetos[0]);
                    this.cdr.detectChanges(); // atualiza o template
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Mentor não possui projeto a ser avaliado',
                    confirmButtonColor: 'rgb(255,0,0)',
                  }).then(() => {
                    this.router.navigate([
                      '/aprovar-mentoria/painel-de-mentorias',
                    ]);
                  });
                }
                this.isLoading = false;
              },
              error: () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Mentor não possui projeto a ser avaliado',
                  confirmButtonColor: 'rgb(255,0,0)',
                });
                this.isLoading = false;
              },
            });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar mentor logado',
          confirmButtonColor: 'rgb(255,0,0)',
        });
        this.isLoading = false;
      },
    });
  }

  isRecomendado(resposta: boolean) {
    this.recomendacao = resposta;
  }

  enviarAvaliacao() {
    this.avaliacaoTentada = true;

    const todasRespondidas =
      Object.keys(this.respostas).length === this.perguntas.length &&
      this.recomendacao !== undefined;

    if (!todasRespondidas) {
      Swal.fire({
        icon: 'warning',
        title: 'Preencha todas as respostas e escolha uma recomendação',
      });
      return;
    }

    if (this.alunoLogado && this.alunoLogado.id) {
      const avaliacao: Avaliacao = {
        resposta1: this.respostas[1],
        resposta2: this.respostas[2],
        resposta3: this.respostas[3],
        resposta4: this.respostas[4],
        resposta5: this.respostas[5],
        resposta6: this.respostas[6],
        comentario: this.comentarios,
        recomendacao: this.recomendacao,
        projeto: { id: this.projeto.id } as Projeto,
        aluno: { id: this.alunoLogado.id } as Aluno,
      };

      this.avaliacaoService.saveAvaliacao(avaliacao).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Avaliação enviada com sucesso!',
          }).then(() => {
            this.router.navigate(['/visual-projeto']);
          });
          this.avaliacaoEnviada = true;
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao enviar avaliação',
            text: 'Tente novamente mais tarde.',
          });
        },
      });
    }
  }

  filtrarPorProjeto(projeto: Projeto) {
    this.projeto = projeto;
    this.cdr.detectChanges();
    this.carregarAlunos(projeto);
  }

  carregarAlunos(projeto: Projeto) {
    projeto.grupo?.alunos?.forEach((aluno) => {
      this.alunos.push(aluno);
    });
  }

  dispensarAvaliacao() {
    Swal.fire({
      title: 'Deseja dispensar a avaliação?',
      text: 'Essa ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, dispensar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Avaliação dispensada para o projeto:', this.projeto.id);
      }
    });
  }

  compararProjetos(p1: Projeto, p2: Projeto): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
}
