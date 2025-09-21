import { Component, inject, Input, OnInit } from '@angular/core';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { ActivatedRoute } from '@angular/router';
import { ProjetoService } from '../../../services/projeto/projeto.service';

@Component({
  selector: 'app-projeto-detalhes',
  templateUrl: './projeto-detalhes.component.html',
  styleUrl: './projeto-detalhes.component.scss',
  standalone: true,
  imports: [CommonModule, NavbarTelasInternasComponent, SidebarComponent],
})
export class ProjetoDetalhesComponent implements OnInit {
  projeto!: Projeto;

    private route = inject(ActivatedRoute);
  private projetoService = inject(ProjetoService)
   
ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.projetoService.findById(id).subscribe((res) => {
        this.projeto = res;
      });
        }
  }
}