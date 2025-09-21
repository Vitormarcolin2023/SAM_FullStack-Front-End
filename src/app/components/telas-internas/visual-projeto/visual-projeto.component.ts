import { Component, inject, OnInit } from '@angular/core';
import { ProjetoDetalhesComponent } from '../projeto-detalhes/projeto-detalhes.component';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-visual-projeto',
  templateUrl: './visual-projeto.component.html',
  styleUrl: './visual-projeto.component.scss',
  standalone: true,
  imports: [CommonModule,RouterModule, ReactiveFormsModule, NavbarTelasInternasComponent, SidebarComponent],
})
 export class VisualProjetoComponent implements OnInit{

  projetoService = inject(ProjetoService);
  router = inject(Router);


  projetos: Projeto[] = [];
  filtroNome = new FormControl('');


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
    this.router.navigate(['/projetos', projeto.id]);
   }

  trackByProjetoId(index: number, projeto: Projeto): number | undefined {
    return projeto.id;
    
  }
}
    
