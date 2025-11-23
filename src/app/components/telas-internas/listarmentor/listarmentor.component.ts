import { Component, inject, OnInit } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Mentor } from '../../../models/mentor/mentor';
import { MentorService } from '../../../services/mentores/mentores.service';
import { CoordenadorService } from '../../../services/coordenacao/coordenador.service';
import { UserdataService } from '../../../services/coordenacao/userdata.service';
import { Curso } from '../../../models/curso/curso';
import { CommonModule } from '@angular/common';
import { ProfessorService } from '../../../services/professor/professor.service'; 
import { Professor } from '../../../models/professor/professor';

@Component({
  selector: 'app-ativarmentor',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './listarmentor.component.html',
  styleUrl: './listarmentor.component.scss',
})
export class ListarMentorComponent implements OnInit {
  mentores: Mentor[] = [];
  usuario: any;
  areasDeAtuacao: string[] = [];
  
  userRole: 'COORDENADOR' | 'PROFESSOR' | 'INDEFINIDO' = 'INDEFINIDO';

  mentorService = inject(MentorService);
  coordenadorService = inject(CoordenadorService);
  userDataService = inject(UserdataService);
  professorService = inject(ProfessorService); 

  ngOnInit(): void {
    this.loadUserRoleAndData();
  }

  private getEmailFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificação do payload do JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.email ?? payload.sub ?? '';
      } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return '';
      }
    }
    return '';
  }

  private loadUserRoleAndData(): void {
    const emailDoToken = this.getEmailFromToken();

    if (!emailDoToken) {
      console.error('Email não encontrado no token. Não é possível buscar o usuário.');
      return; 
    }

    this.coordenadorService.getCoordenadorPorEmail(emailDoToken).subscribe({
      next: (coordenador) => {
        if (coordenador && coordenador.id) {
          this.userRole = 'COORDENADOR';
          this.usuario = coordenador;
          
          if (coordenador.cursos && coordenador.cursos.length > 0) {
            this.areasDeAtuacao = coordenador.cursos
              .map((curso: Curso) => curso.areaDeAtuacao?.nome)
              .filter((nome: string | undefined): nome is string => !!nome);
          }
          
          this.userDataService.setCoordenador(coordenador);
          this.loadMentors();
        } else {
          this.tryLoadProfessor(emailDoToken);
        }
      },
      error: () => {
        this.tryLoadProfessor(emailDoToken);
      },
    });
  }

  private tryLoadProfessor(email: string): void {
    
    this.professorService.getProfessorPorEmail(email).subscribe({
      next: (professor: Professor | null) => { 
        if (professor && professor.id) {
          this.userRole = 'PROFESSOR';
          this.usuario = professor;
          
          if (professor.cursos && professor.cursos.length > 0) {
              this.areasDeAtuacao = professor.cursos
               .map((curso: Curso) => curso.areaDeAtuacao?.nome)
               .filter((nome: string | undefined): nome is string => !!nome);
          }
          
          this.loadMentors(); 
        } else {
          console.error('Usuário não encontrado ou função não reconhecida.');
          this.userRole = 'INDEFINIDO';
          this.loadMentors();
        }
      },
      error: (erro) => {
        console.error('Erro ao buscar dados do Professor. Perfil Indefinido:', erro);
        this.userRole = 'INDEFINIDO';
        this.loadMentors();
      },
    });
  }

  loadMentors() {
    this.mentorService.listAll().subscribe({
      next: (mentores) => {
        let mentoresFiltrados: Mentor[] = [];
        
        if (this.userRole === 'COORDENADOR' || this.userRole === 'PROFESSOR') {
          if (this.areasDeAtuacao.length > 0) {
            mentoresFiltrados = mentores.filter(
              (mentor) =>
                mentor.areaDeAtuacao?.nome &&
                this.areasDeAtuacao.includes(mentor.areaDeAtuacao.nome)
            );
          } else if (this.userRole === 'COORDENADOR') {
            console.warn('[COORDENADOR] Nenhuma área de atuação definida para filtragem.');
          } else {
              console.warn('[PROFESSOR] Nenhuma área de atuação definida para filtragem.');
          }
        } else {
          mentoresFiltrados = [];
        }

        this.mentores = mentoresFiltrados.sort((a, b) => {
          const statusOrder = (status: string) => {
            if (status === 'PENDENTE') return 1;
            if (status === 'ATIVO') return 2;
            if (status === 'INATIVO') return 3;
            return 4;
          };
          return statusOrder(a.statusMentor) - statusOrder(b.statusMentor);
        });
      },
      error: (erro) => {
        console.error('Erro ao listar mentores:', erro);
      },
    });
  }

  /**
   * Exibe um alerta/notificação usando SweetAlert2.
   * @param message A mensagem a ser exibida.
   * @param icon O ícone da mensagem ('success', 'error', 'warning', 'info', 'question').
   */
  private showAlert(message: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'warning'): void {
    Swal.fire({
      icon: icon,
      title: message,
      // Se preferir um toast, pode usar as seguintes opções (e remover o 'title'):
      // toast: true,
      // position: 'top-end',
      // showConfirmButton: false,
      // timer: 3000,
    });
  }
  
  /**
   * Exibe um modal de confirmação usando SweetAlert2.
   * @param message A mensagem de confirmação.
   * @returns Promise<boolean> que resolve para true se confirmado, false caso contrário.
   */
  private showConfirmationModal(message: string): Promise<boolean> {
    return Swal.fire({
        title: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: ' #00995E',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, confirmar!',
        cancelButtonText: 'Cancelar'
    }).then((result: SweetAlertResult) => {
        return result.isConfirmed; 
    });
  }

  //Ativar Mentor (Usado para status PENDENTE)
  ativarMentor(mentorId: number | undefined): void {
    if (this.userRole !== 'COORDENADOR') {
      this.showAlert('Apenas Coordenadores podem ativar mentores.', 'error');
      return;
    }
    
    if (mentorId === undefined) {
      this.showAlert('Não foi possível ativar o mentor. ID não encontrado.', 'error');
      return;
    }

    this.showConfirmationModal('Você tem certeza que deseja ativar este mentor?').then(confirmarAtivacao => {
      if (confirmarAtivacao) {
        this.coordenadorService.ativarMentor(mentorId).subscribe({
          next: () => {
            this.showAlert('Mentor ativado com sucesso!', 'success');
            this.loadMentors(); 
          },
          error: (erro) => {
            console.error('Erro ao ativar mentor:', erro);
            this.showAlert('Ocorreu um erro e o mentor não pôde ser ativado.', 'error');
          },
        });
      }
    });
  }

  //Reativar Mentor (Usado para status INATIVO)
  reativarMentor(mentorId: number | undefined): void {
    if (this.userRole !== 'COORDENADOR' || mentorId === undefined) {
      this.showAlert('Apenas Coordenadores podem reativar mentores.', 'error');
      return;
    }

    // Mensagem diferente: Reativar
    this.showConfirmationModal('Você tem certeza que deseja REATIVAR este mentor?').then(confirmarReativacao => {
      if (confirmarReativacao) {
          // Chama o mesmo serviço de ativação 
          this.coordenadorService.ativarMentor(mentorId).subscribe({
              next: () => {
                  this.showAlert('Mentor reativado com sucesso!', 'success');
                  this.loadMentors(); 
              },
              error: (erro) => {
                  console.error('Erro ao reativar mentor:', erro);
                  this.showAlert('Ocorreu um erro e o mentor não pôde ser reativado.', 'error');
              },
          });
      }
    });
  }

  //Desativar Mentor
  desativarMentor(mentorId: number | undefined): void {
    if (this.userRole !== 'COORDENADOR') {
      this.showAlert('Apenas Coordenadores podem desativar mentores.', 'error');
      return;
    }
    
    if (mentorId === undefined) {
      this.showAlert('Não foi possível desativar o mentor. ID não encontrado.', 'error');
      return;
    }

    this.showConfirmationModal('Você tem certeza que deseja desativar este mentor?').then(confirmarDesativacao => {
      if (confirmarDesativacao) {
        this.coordenadorService.inativarMentor(mentorId).subscribe({
          next: () => {
            this.showAlert('Mentor desativado com sucesso!', 'success');
            this.loadMentors(); 
          },
          error: (erro) => {
            console.error('Erro ao desativar mentor:', erro);
            this.showAlert('Ocorreu um erro e o mentor não pôde ser desativado.', 'error');
          },
        });
      }
    });
  }
}