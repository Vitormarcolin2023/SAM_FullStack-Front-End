import { Component, inject } from '@angular/core';
import { Mentor } from '../../models/mentor/mentor';
import { MentorService } from '../../services/mentores/mentores.service';
import { CoordenadorService } from '../../services/coordenador.service';

@Component({
  selector: 'app-ativarmentor',
  imports: [],
  templateUrl: './ativarmentor.component.html',
  styleUrl: './ativarmentor.component.scss',
})
export class AtivarmentorComponent {
  mentores: Mentor[] = [];

  constructor() {}

  mentorService = inject(MentorService);
  coordenadorService = inject(CoordenadorService);


  ngOnInit(): void {
    this.listAll();
  }

listAll() {
  this.mentorService.listAll().subscribe({
    next: (mentores) => {
      this.mentores = mentores.sort((a, b) => {
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
  
  const confirmarAtivacao = confirm('Você tem certeza que deseja ativar este mentor?');

  if (confirmarAtivacao) {
    this.coordenadorService.ativarMentor(mentorId).subscribe({
      next: () => {
        console.log('Mentor ativado com sucesso!');
        this.listAll();
      },
      error: (erro) => {
        console.error('Erro ao ativar mentor:', erro);
        alert('Ocorreu um erro e o mentor não pôde ser ativado.');
      }
    });
  }
}

desativarMentor(mentorId: number | undefined): void {
  if (mentorId === undefined) {
    console.error('Erro: ID do mentor não fornecido para desativação.');
    alert('Não foi possível ativar o mentor. ID não encontrado.');
    return;
  }
  
  const confirmarAtivacao = confirm('Você tem certeza que deseja desativar este mentor?');

  if (confirmarAtivacao) {
    this.coordenadorService.inativarMentor(mentorId).subscribe({
      next: () => {
        console.log('Mentor desativado com sucesso!');
        this.listAll();
      },
      error: () => {
        console.error('Erro ao dessativar mentor:');
        alert('Ocorreu um erro e o mentor não pôde ser ativado.');
      }
    });
  }
}

}
