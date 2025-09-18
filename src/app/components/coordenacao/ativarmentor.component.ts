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
        this.mentores = mentores;
      },
      error: (erro) => {
        console.log('Ocorreu um erro!');
      },
    });
  }

ativarMentor(mentorId: number | undefined): void {
  // VERIFICAÇÃO CRÍTICA
  // Se o mentorId for undefined, saímos da função para evitar o erro.
  if (mentorId === undefined) {
    console.error('Erro: ID do mentor não fornecido para ativação.');
    alert('Não foi possível ativar o mentor. ID não encontrado.');
    return;
  }

  // Se o código chegou até aqui, temos certeza de que mentorId é um número.
  
  const confirmarAtivacao = confirm('Você tem certeza que deseja ativar este mentor?');

  if (confirmarAtivacao) {
    this.coordenadorService.ativarMentor(mentorId).subscribe({
      next: () => {
        console.log('Mentor ativado com sucesso!');
        // Idealmente, aqui você deve atualizar o status do mentor na sua lista
        // sem precisar recarregar a página inteira.
      },
      error: (erro) => {
        console.error('Erro ao ativar mentor:', erro);
        alert('Ocorreu um erro e o mentor não pôde ser ativado.');
      }
    });
  }
}

desativarMentor(mentorId: number | undefined): void {
  // VERIFICAÇÃO CRÍTICA
  // Se o mentorId for undefined, saímos da função para evitar o erro.
  if (mentorId === undefined) {
    console.error('Erro: ID do mentor não fornecido para desativação.');
    alert('Não foi possível ativar o mentor. ID não encontrado.');
    return;
  }

  // Se o código chegou até aqui, temos certeza de que mentorId é um número.
  
  const confirmarAtivacao = confirm('Você tem certeza que deseja desativar este mentor?');

  if (confirmarAtivacao) {
    this.coordenadorService.desativarMentor(mentorId).subscribe({
      next: () => {
        console.log('Mentor desativado com sucesso!');
        // Idealmente, aqui você deve atualizar o status do mentor na sua lista
        // sem precisar recarregar a página inteira.
      },
      error: (erro) => {
        console.error('Erro ao dessativar mentor:', erro);
        alert('Ocorreu um erro e o mentor não pôde ser ativado.');
      }
    });
  }
}

}
