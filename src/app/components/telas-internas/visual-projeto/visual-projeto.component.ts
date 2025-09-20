import { Component, inject } from '@angular/core';
import { ProjetoDetalhesComponent } from '../projeto-detalhes/projeto-detalhes.component';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visual-projeto',
  templateUrl: './visual-projeto.component.html',
  styleUrl: './visual-projeto.component.scss',
  standalone: true,
  imports: [ProjetoDetalhesComponent, CommonModule, MdbModalModule],
})
 export class VisualProjetoComponent {
  projetoService = inject(ProjetoService);
  modalService = inject(MdbModalService);
  projetos: Projeto[] = [];
  modalRef!: MdbModalRef<ProjetoDetalhesComponent>;

  ngOnInit() {
    this.carregarProjetos();
  }

  carregarProjetos() {
    this.projetoService.findAll().subscribe({
      next: (projetos) => this.projetos = projetos,
      error: (erro) => console.error('Erro ao carregar projetos',erro)
    });
  }
 
  abrirDetalhes(projeto: Projeto) {
    this.modalRef = this.modalService.open(ProjetoDetalhesComponent, {
      data: { projeto: projeto },
      modalClass: 'modal-lg'
    });
  }
}
