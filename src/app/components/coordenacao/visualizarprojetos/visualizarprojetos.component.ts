import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NavbarTelasInternasComponent } from '../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../design/sidebar/sidebar.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ProjetoDetalhesComponent } from '../../telas-internas/projeto-detalhes/projeto-detalhes.component';
import { CoordenadorService } from '../../../services/coordenador.service';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { Coordenador } from '../../../models/coordenacao/coordenador';
import { Projeto } from '../../../models/projeto/projeto';
import { DatePipe } from '@angular/common';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-visualizarprojetos',
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
  coordenador!: Coordenador;
  projetos: Projeto[] = [];
  coordenadorId!: number;

  ngOnInit() {
    this.buscarCoordenador();
  }

  private buscarCoordenador(): void {
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

    if (emailDoToken) {
      this.coordenadorService.getCoordenadorPorEmail(emailDoToken).subscribe({
        next: (coordenador) => {
          if (coordenador) {
            this.coordenadorId = coordenador.id;

            const primeiroCurso =
              coordenador.cursos && coordenador.cursos.length > 0
                ? coordenador.cursos[0]
                : null;

            const areaDeAtuacaoId = primeiroCurso?.areaDeAtuacao?.id;

            if (areaDeAtuacaoId) {
              console.log('ID da Área de Atuação:', areaDeAtuacaoId);
              this.carregarProjetosPorArea(areaDeAtuacaoId);
            } else {
              console.warn(
                'O coordenador não tem cursos ou a área de atuação do curso não foi encontrada.'
              );
              this.projetos = [];
            }
          } else {
            console.log('Coordenador não encontrado.');
          }
        },
        error: (erro) => {
          console.error('Erro ao buscar dados do coordenador:', erro);
        },
      });
    } else {
      console.log('Não foi possível obter o email para buscar o coordenador.');
    }
  }

  carregarProjetosPorArea(areaId: number): void {
    this.projetoService.buscarPorArea(areaId).subscribe({
      next: (data) => {
        this.projetos = data;
        console.log('Projetos carregados por área:', data);
      },
      error: (err) => {
        console.error('Erro ao carregar projetos por área', err);
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
