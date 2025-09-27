import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NavbarTelasInternasComponent } from '../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../design/sidebar/sidebar.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ProjetoDetalhesComponent } from '../../telas-internas/projeto-detalhes/projeto-detalhes.component';
import { CoordenadorService } from '../../../services/coordenacao/coordenador.service';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { ProfessorService } from '../../../services/professor/professor.service';
import { Coordenador } from '../../../models/coordenacao/coordenador';
import { Professor } from '../../../models/professor/professor';
import { Projeto } from '../../../models/projeto/projeto';
import { DatePipe } from '@angular/common';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-visualizarprojetos',
  standalone: true,
  imports: [
    NavbarTelasInternasComponent,
    SidebarComponent,
    DatePipe,
    MdbModalModule,
  ],
  templateUrl: './visualizarprojetos.component.html',
  styleUrl: './visualizarprojetos.component.scss',
})
export class VisualizarprojetosComponent {
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<ProjetoDetalhesComponent>;
  @ViewChild('projetoDetalhe') projetoDetalhe!: TemplateRef<any>;

  coordenadorService = inject(CoordenadorService);
  projetoService = inject(ProjetoService);
  professorService = inject(ProfessorService);

  coordenador!: Coordenador;
  professor!: Professor;
  projetos: Projeto[] = [];
  perfilLogado: 'coordenador' | 'professor' | null = null;

  ngOnInit() {
    this.carregarDadosDoUsuarioLogado();
  }

  private carregarDadosDoUsuarioLogado(): void {
    const token = localStorage.getItem('token');
    let emailDoToken = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        emailDoToken = payload.email ?? payload.sub ?? '';
      } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return;
      }
    }

    if (!emailDoToken) {
      console.log('Não foi possível obter o email para buscar o usuário.');
      this.projetos = [];
      return;
    }

    this.coordenadorService.getCoordenadorPorEmail(emailDoToken).subscribe({
      next: (coordenador) => {
        if (coordenador && coordenador.id) {
          this.perfilLogado = 'coordenador';
          this.coordenador = coordenador;
          console.log('Usuário encontrado como Coordenador.');
          this.carregarProjetosDoCoordenador(coordenador);
        } else {
          this.buscarProfessor(emailDoToken);
        }
      },
      error: (erro) => {
        console.warn('Busca de Coordenador falhou, tentando buscar como Professor...');
        this.buscarProfessor(emailDoToken);
      },
    });
  }

  private buscarProfessor(email: string): void {
    this.professorService.getProfessorPorEmail(email).subscribe({
      next: (professor) => {
        if (professor && professor.id) {
          this.perfilLogado = 'professor';
          this.professor = professor;
          console.log('Usuário encontrado como Professor.');
          this.carregarProjetosDoProfessor(professor.id);
        } else {
          console.warn('Usuário não encontrado como Coordenador ou Professor.');
          this.projetos = [];
        }
      },
      error: (erro) => {
        console.error('Erro ao buscar dados do professor:', erro);
        this.projetos = [];
      },
    });
  }

  private carregarProjetosDoCoordenador(coordenador: Coordenador): void {
    const primeiroCurso =
      coordenador.cursos && coordenador.cursos.length > 0
        ? coordenador.cursos[0]
        : null;

    const areaDeAtuacaoId = primeiroCurso?.areaDeAtuacao?.id;

    if (areaDeAtuacaoId) {
      console.log('COORDENADOR: Carregando projetos pela Área de Atuação:', areaDeAtuacaoId);
      
      this.projetoService.buscarPorArea(areaDeAtuacaoId).subscribe({
        next: (data) => {
          this.projetos = data;
        },
        error: (err) => {
          console.error('Erro ao carregar projetos por área', err);
        },
      });
    } else {
      console.warn('Coordenador não tem cursos válidos para carregar projetos.');
      this.projetos = [];
    }
  }

  private carregarProjetosDoProfessor(professorId: number): void {
    console.log('PROFESSOR: Carregando projetos onde é associado (ID:', professorId, ')');
    
    this.projetoService.buscarPorProfessor(professorId).subscribe({ 
      next: (data) => {
        this.projetos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar projetos do professor', err);
      },
    });
  }

  visualizarProjeto(projeto: Projeto) {
    this.modalRef = this.modalService.open(ProjetoDetalhesComponent, {
      data: { projeto },
      modalClass: 'modal-lg',
    });
  }
}