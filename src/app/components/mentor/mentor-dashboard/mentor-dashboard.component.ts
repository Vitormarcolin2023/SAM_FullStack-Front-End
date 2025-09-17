import { Component, OnInit } from '@angular/core';
import { MentorService } from '../../../services/mentores/mentores.service';
import { Mentor } from '../../../models/mentor/mentor';

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html'
})
export class MentorDashboardComponent implements OnInit {
  // Inicializa a variável 'mentor' como null para evitar erros antes que os dados sejam carregados
  mentor: Mentor | null = null;
  // Usar um ID de um mentor que existe no banco de dados
  // Altere este valor para o ID necessário
  idDoMentorParaTeste: number = 1;

  constructor(private mentorService: MentorService) { }

  ngOnInit(): void {
    // Quando o componente for inicializado, faz a chamada para o serviço
    this.mentorService.getMentorById(this.idDoMentorParaTeste).subscribe({
      next: (dados) => {
        // Se a chamada for bem-sucedida, os dados são atribuídos à variável 'mentor'
        this.mentor = dados;
        console.log('Dados do mentor carregados:', this.mentor);
      },
      error: (erro) => {
        // Se houver um erro, mostramos no console
        console.error('Erro ao buscar mentor:', erro);
      }
    });
  }
}