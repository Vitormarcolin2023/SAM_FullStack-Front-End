import { Component, inject, OnInit } from '@angular/core';
import { ProjetoDetalhesComponent } from '../projeto-detalhes/projeto-detalhes.component';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";

@Component({
  selector: 'app-visual-projeto',
  templateUrl: './visual-projeto.component.html',
  styleUrl: './visual-projeto.component.scss',
  standalone: true,
  imports: [CommonModule, MdbModalModule, ReactiveFormsModule, NavbarTelasInternasComponent, SidebarComponent, ProjetoDetalhesComponent],
})
 export class VisualProjetoComponent implements OnInit{
  
  projetoService = inject(ProjetoService);
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<ProjetoDetalhesComponent>;
  
  projetos: Projeto[] = [];
  filtroNome = new FormControl('');
  filtroAtuacao = new FormControl('');
  todasAtuacoes: string[] = [];


  ngOnInit() {
    this.carregarProjetos();
    
    this.filtroNome.valueChanges.subscribe(nome => {
      if (nome && nome.length >= 3) { 
        this.projetoService.buscarPorNome(nome)
          .subscribe(projs => this.projetos = projs);
      } else if (nome === '') {
        this.carregarProjetos();
      }
    });
  
  }

  carregarProjetos() {
    this.projetoService.findAll()
      .subscribe(projs => this.projetos = projs);
  }

   abrirDetalhes(projeto: Projeto) {
    this.modalRef = this.modalService.open(ProjetoDetalhesComponent, {
      data: { projeto },
      modalClass: 'modal-lg'
    });
  }

  trackByProjetoId(index: number, projeto: Projeto): number | undefined {
    return projeto.id;
  }
}
    
