import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { Grupo, GrupoDto } from '../../../../models/grupo/grupo';
import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import { Router } from '@angular/router';
import { Professor } from '../../../../models/professor/professor';
import { Curso } from '../../../../models/curso/curso';
import { ProfessorService } from '../../../../services/professor/professor.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-criar-grupo',
  imports: [FormsModule],
  templateUrl: './criar-grupo.component.html',
  styleUrl: './criar-grupo.component.scss',
  standalone: true,
})
export class CriarGrupoComponent {
  alunos: Aluno[] = [];
  alunosFiltrados: Aluno[] = [];
  alunoService = inject(AlunoService);
  aluno!: Aluno;
  router = inject(Router);
  nomeGrupo: string = '';
  professoresFiltrados: Professor[] = [];
  professorService = inject(ProfessorService);

  alunosSelecionados = signal<Aluno[]>([]);
  professoresSelecionados = signal<Professor[]>([]);

  periodosDisponiveis: string[] = [
    '1º Período',
    '2º Período',
    '3º Período',
    '4º Período',
    '5º Período',
    '6º Período',
    '7º Período',
    '8º Período',
    '9º Período',
    '10º Período'
  ];

  constructor(private grupoService: GrupoService) {}

  ngOnInit() {
    this.alunoLogado();
  }

  alunoLogado() {
    this.alunoService.getMyProfile().subscribe({
      next: (aluno) => {
        this.aluno = aluno;
        if (aluno.curso.id != null) {
          this.alunosNoCurso(aluno.curso.id);
        }
        if (aluno.id) {
          this.verificaGrupo(aluno.id);
          if (aluno.curso.professores) {
            this.professoresFiltrados = aluno.curso.professores;
          }
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar aluno logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
      },
    });
  }

  alunosNoCurso(idCurso: number) {
    this.alunoService.findAlunosByCurso(idCurso).subscribe({
      next: (alunos) => {
        this.alunos = alunos.filter((a) => a.id !== this.aluno.id);
        this.alunosFiltrados = [...this.alunos];
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Algo deu errado',
          text: `${err.error}`,
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
      },
    });
  }

  verificaGrupo(id: number) {
    this.grupoService.getGrupoByAlunoId(id).subscribe({
      next: (grupo) => {
        if (grupo == null) {
          return;
        }
        this.aluno.grupo = grupo;
        Swal.fire({
          icon: 'error',
          title: 'Não é possível acessar essa página!',
          text: 'Aluno já possui grupo!',
          confirmButtonColor: 'rgb(255, 0, 0)',
        }).then(() => {
          this.router.navigate(['/grupo/grupo-details']);
        });
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  pesquisarAlunos(event: Event) {
    const valor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    let container = document.getElementById('list-alunos');

    if (container) {
      container.style.display = 'block';
    }

    if (valor.length > 0) {
      this.alunosFiltrados = this.alunos.filter((a) =>
        a.nome.toLowerCase().includes(valor)
      );
    } else {
      this.alunosFiltrados = this.alunos;
    }
  }

  pesquisarProfessores(event: Event) {
      const valor = (event.target as HTMLInputElement).value.trim().toLowerCase();
      let container = document.getElementById('list-professores');

      if(container){
        container.style.display = 'block';
      }

      if(valor.length > 0) {
        this.professoresFiltrados = this.professoresFiltrados.filter((p) => 
          p.nome.toLowerCase().includes(valor)
        );
      } else {
        this.professoresFiltrados = this.professoresFiltrados;
      }
  }

  toggleAlunoSelecao(aluno: Aluno) {
    this.alunosSelecionados.update((alunos) => {
      const index = alunos.findIndex((a) => a.id === aluno.id);

      if (index > -1) {
        alunos.splice(index, 1);
      } else {
        alunos.push(aluno);
      }
      return [...alunos];
    });
  }

  toggleProfessorSelecao(professor: Professor){
    this.professoresSelecionados.update((professores) => {
      const index = professores.findIndex((p) => p.id === professor.id);

      if(index > -1){
        professores.splice(index, 1);
      } else {
        professores.push(professor);
      }
      return [...professores];
    });
  }

  isAlunoSelecionado(aluno: Aluno): boolean {
    return this.alunosSelecionados().some((a) => a.id === aluno.id);
  }

  isProfessorSelecionado(professor: Professor): boolean {
    return this.professoresSelecionados().some((p) => p.id === professor.id);
  }

  criarGrupo() {
    if (!this.nomeGrupo || this.nomeGrupo.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Nome Necessário',
        text: 'Por favor, insira um nome para o grupo.',
        confirmButtonColor: 'rgb(255, 0, 0)',
      });
      return;
    }

    const idsSelecionados: number[] = this.alunosSelecionados().map(
      (a) => a.id!
    );

    if (this.aluno && this.aluno.id) {
      if (!idsSelecionados.includes(this.aluno.id)) {
        idsSelecionados.push(this.aluno.id);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro de Autenticação',
        text: 'Não foi possível identificar o administrador do grupo.',
        confirmButtonColor: 'rgb(255, 0, 0)',
      });
      return;
    }
    if (idsSelecionados.length < 3 || idsSelecionados.length > 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Limite de Integrantes',
        text: 'O grupo deve ter no mínimo 3 e no máximo 6 integrantes (incluindo você).',
        confirmButtonColor: 'rgb(255, 0, 0)',
      });
      return;
    }

    const grupoDto: GrupoDto = {
      nome: this.nomeGrupo,
      alunoAdminId: this.aluno.id!,
      alunosIds: idsSelecionados,
    };

    this.grupoService.criarGrupo(grupoDto).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Grupo Criado!',
          text: `O grupo "${this.nomeGrupo}" foi criado com sucesso.`,
          confirmButtonColor: 'rgb(0, 153, 94)',
        }).then(() => {
          this.router.navigate(['/grupo/grupo-details']);
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Falha na Criação',
          text:
            err.error.message ||
            'Houve um erro ao criar o grupo. Verifique se algum integrante já tem um grupo.',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
      },
    });
  }
}
