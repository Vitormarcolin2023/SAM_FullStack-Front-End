import { Component, inject } from '@angular/core';
import { Mentor } from '../../../models/mentor/mentor';
import { MentorService } from '../../../services/mentores/mentores.service';
import { CoordenadorService } from '../../../services/coordenacao/coordenador.service';
import { UserdataService } from '../../../services/coordenacao/userdata.service';
import { Curso } from '../../../models/curso/curso';

@Component({
  selector: 'app-ativarmentor',
  imports: [],
  templateUrl: './ativarmentor.component.html',
  styleUrl: './ativarmentor.component.scss',
})
export class AtivarmentorComponent {
  mentores: Mentor[] = [];
  coordenador: any;
  areasCoordenador: string[] = [];

  constructor() {}

  mentorService = inject(MentorService);
  coordenadorService = inject(CoordenadorService);
  userDataService = inject(UserdataService);

  ngOnInit(): void {
    this.buscarDadosCoordenador();
  }

  private buscarDadosCoordenador(): void {
    const token = localStorage.getItem('token');
    let emailDoToken = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        emailDoToken = payload.email ?? payload.sub ?? '';
        console.log('Email extraído do token:', emailDoToken);
      } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return;
      }
    }

    if (emailDoToken) {
      this.coordenadorService.getCoordenadorPorEmail(emailDoToken).subscribe({
        next: (coordenador) => {
          this.coordenador = coordenador;
          console.log('Dados do coordenador:', this.coordenador);

          if (coordenador.cursos && coordenador.cursos.length > 0) {
            this.areasCoordenador = coordenador.cursos.map(
              (curso: Curso) => curso.areaDeAtuacao.nome
            );
            console.log(
              'Áreas de atuação do coordenador:',
              this.areasCoordenador
            );
          }

          this.userDataService.setCoordenador(coordenador);
          this.listAll();
        },
        error: (erro) => {
          console.error('Erro ao buscar dados do coordenador:', erro);
          this.listAll();
        },
      });
    } else {
      console.error(
        'Não foi possível obter o email para buscar o coordenador.'
      );
      this.listAll();
    }
  }

  listAll() {
    this.mentorService.listAll().subscribe({
      next: (mentores) => {
        const mentoresFiltrados = mentores.filter(
          (mentor) =>
            mentor.areaDeAtuacao?.nome &&
            this.areasCoordenador.includes(mentor.areaDeAtuacao.nome)
        );

        this.mentores = mentoresFiltrados.sort((a, b) => {
          if (a.statusMentor === 'PENDENTE' && b.statusMentor !== 'PENDENTE') {
            return -1;
          }
          if (a.statusMentor !== 'PENDENTE' && b.statusMentor === 'PENDENTE') {
            return 1;
          }
          if (a.statusMentor === 'ATIVO' && b.statusMentor === 'INATIVO') {
            return -1;
          }
          if (a.statusMentor === 'INATIVO' && b.statusMentor === 'ATIVO') {
            return 1;
          }
          return 0;
        });
      },
      error: (erro) => {
        console.log('Ocorreu um erro!');
      },
    });
  }

  ativarMentor(mentorId: number | undefined): void {
    if (mentorId === undefined) {
      console.error('Erro: ID do mentor não fornecido para ativação.');
      alert('Não foi possível ativar o mentor. ID não encontrado.');
      return;
    }

    const confirmarAtivacao = confirm(
      'Você tem certeza que deseja ativar este mentor?'
    );

    if (confirmarAtivacao) {
      this.coordenadorService.ativarMentor(mentorId).subscribe({
        next: () => {
          console.log('Mentor ativado com sucesso!');
          this.listAll();
        },
        error: (erro) => {
          console.error('Erro ao ativar mentor:', erro);
          alert('Ocorreu um erro e o mentor não pôde ser ativado.');
        },
      });
    }
  }

  desativarMentor(mentorId: number | undefined): void {
    if (mentorId === undefined) {
      console.error('Erro: ID do mentor não fornecido para desativação.');
      alert('Não foi possível ativar o mentor. ID não encontrado.');
      return;
    }

    const confirmarAtivacao = confirm(
      'Você tem certeza que deseja desativar este mentor?'
    );

    if (confirmarAtivacao) {
      this.coordenadorService.inativarMentor(mentorId).subscribe({
        next: () => {
          console.log('Mentor desativado com sucesso!');
          this.listAll();
        },
        error: () => {
          console.error('Erro ao dessativar mentor:');
          alert('Ocorreu um erro e o mentor não pôde ser ativado.');
        },
      });
    }
  }
}
