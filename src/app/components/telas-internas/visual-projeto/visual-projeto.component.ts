import { Component, inject, OnInit } from '@angular/core';
import { ProjetoDetalhesComponent } from '../projeto-detalhes/projeto-detalhes.component';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { MdbModalRef, MdbModalService, MdbModalModule } from 'mdb-angular-ui-kit/modal'; 
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../../design/sidebar/sidebar.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-visual-projeto',
  templateUrl: './visual-projeto.component.html',
  styleUrls: ['./visual-projeto.component.scss'], 
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarComponent,
    MdbModalModule, 
  ],
})
export class VisualProjetoComponent implements OnInit {
  projetoService = inject(ProjetoService);
  router = inject(Router);
  modalService = inject(MdbModalService);

  projetos: Projeto[] = [];
  filtroNome = new FormControl('');
  modalRef: MdbModalRef<ProjetoDetalhesComponent> | null = null;

  ngOnInit() {
    this.carregarProjetos();

    this.filtroNome.valueChanges.subscribe((nome) => {
      if (nome && nome.length >= 3) {
        this.projetoService.buscarPorNome(nome).subscribe((projs) => (this.projetos = projs));
      } else if (nome === '') {
        this.carregarProjetos();
      }
    });
  }

  carregarProjetos(): void {
    this.projetoService.findAll().subscribe({
      next: (projs) => {
        this.projetos = projs;
      //  this.verificarProjetosComDataFinal();
  },
  error: (err) => {
      console.error('Erro ao carregar projetos:', err);
  }
});
}

  /*verificarProjetosComDataFinal(): void {
    const hoje = new Date();

    this.projetos.forEach((projeto) => {
    const dataFinal = new Date(projeto.dataFinalProjeto);

    if (hoje >= dataFinal && !projeto.arquivado) {
      this.arquivarEForcarAvaliacao(projeto);
    }
  });
}*/

   abrirModalDetalhes(projeto: Projeto) {
    this.modalRef = this.modalService.open(ProjetoDetalhesComponent, {
      data: { projeto },
      modalClass: 'modal-lg',
    
    });
  }

  trackByProjetoId(index: number, projeto: Projeto): number | undefined {
    return projeto.id;
  }
}
