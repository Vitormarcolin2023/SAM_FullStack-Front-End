import { Component, inject, OnInit } from '@angular/core';
import { ProjetoDetalhesComponent } from '../projeto-detalhes/projeto-detalhes.component';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { MdbModalRef, MdbModalService, MdbModalModule } from 'mdb-angular-ui-kit/modal'; 
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavbarTelasInternasComponent } from '../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../design/sidebar/sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { TokenDecode } from '../../../models/token/token-decode';

export enum StatusProjeto {
  ATIVO = 'ATIVO',
  NAO_ACEITO = 'NAO_ACEITO',
  ARQUIVADO = 'ARQUIVADO',
  EM_APROVACAO = 'EM_APROVACAO',
}

@Component({
  selector: 'app-visual-projeto',
  templateUrl: './visual-projeto.component.html',
  styleUrls: ['./visual-projeto.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NavbarTelasInternasComponent,
    SidebarComponent,
    MdbModalModule,
  ],
})
export class VisualProjetoComponent implements OnInit {
  private projetoService = inject(ProjetoService);
  private router = inject(Router);
  private modalService = inject(MdbModalService);

  tokenService = inject(TokenDecode)

  projetos: Projeto[] = [];
  projetosOriginais: Projeto[] = [];
  filtroNome = new FormControl('');              
  filtroStatus = new FormControl<string | null>(null);

  modalRef: MdbModalRef<ProjetoDetalhesComponent> | null = null;

   statusDisponiveis: string[] = [
    'ATIVO',
    'NAO_ACEITO',
    'ARQUIVADO',
    'EM_APROVACAO',
  ];

  
  ngOnInit() {
    this.carregarProjetos();

    this.filtroNome.valueChanges.subscribe(() => this.aplicarFiltros());
    this.filtroStatus.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  carregarProjetos() {
  const role = this.tokenService.getRole();
  const userId = this.tokenService.getId();

  if (!userId){
    console.error('Usuário não identificado');
    return
  }

  const ordenarProjetos = (projetos: Projeto[], statusPrioritario: StatusProjeto) => {
    return [...projetos].sort((a, b) => {
      if (a.statusProjeto === statusPrioritario && b.statusProjeto !== statusPrioritario) return -1;
      if (a.statusProjeto !== statusPrioritario && b.statusProjeto === statusPrioritario) return 1;
      return 0;
    });
  };

  
  switch (role) {

    case 'ALUNO':
    this.projetoService.buscarProjetosDoAluno(userId)
        .subscribe(res => {
          const filtrados = res.filter(p => p.statusProjeto === StatusProjeto.ATIVO);
          this.projetos = ordenarProjetos(filtrados, StatusProjeto.ATIVO);
        });
          break;

       case 'ALUNO_ADMIN':
       this.projetoService.buscarProjetosDoAluno(userId)
        .subscribe(res => {
          const filtrados = res.filter(p =>
            [StatusProjeto.ATIVO, StatusProjeto.ARQUIVADO, StatusProjeto.EM_APROVACAO].includes(p.statusProjeto as StatusProjeto)
          );
          this.projetos = ordenarProjetos(filtrados, StatusProjeto.ATIVO);
        });
        break;

       case 'PROFESSOR':
       this.projetoService.buscarPorProfessor(userId)
        .subscribe(res => {
          this.projetos = ordenarProjetos(res, StatusProjeto.ATIVO);
        });
      break;

        case 'COORDENADOR':
       this.projetoService.findAll()
        .subscribe(res => {
          this.projetos = ordenarProjetos(res, StatusProjeto.ATIVO);
        });
      break;

      case 'MENTOR':
      this.projetoService.buscarProjetosAtivos(userId)
        .subscribe(res => {
          const emAprovacao = res.filter(p => p.statusProjeto === StatusProjeto.EM_APROVACAO);
          const outros = res.filter(p =>
            [StatusProjeto.ATIVO, StatusProjeto.ARQUIVADO].includes(p.statusProjeto as StatusProjeto)
          );
          const todos = [...emAprovacao, ...outros];
          this.projetos = ordenarProjetos(todos, StatusProjeto.EM_APROVACAO);
        });
    break;


      default: 
      console.warn('Usuário desconhecido');
      this.projetos = [];
      break;
  }
}

  aplicarFiltros() {
    const nome = this.filtroNome.value?.trim() || '';
    const status = this.filtroStatus.value;

    let projetosFiltrados = [...this.projetos];

    if (nome) {
      projetosFiltrados = projetosFiltrados.filter(p =>
        p.nomeDoProjeto.toLowerCase().includes(nome.toLowerCase())
      );
    }

    if (status) {
      projetosFiltrados = projetosFiltrados.filter(p =>
        p.statusProjeto === status
      );
    }


    this.carregarProjetos();
  }

  abrirModalDetalhes(projeto: Projeto) {
    this.modalRef = this.modalService.open(ProjetoDetalhesComponent, {
      data: { projeto },
      modalClass: 'modal-lg',
    });
  }

  limparFiltros() {
    this.filtroNome.setValue('');
    this.filtroStatus.setValue(null); 
    this.carregarProjetos();
  }

  trackByProjetoId(index: number, projeto: Projeto): number | undefined {
    return projeto.id;
  }
}