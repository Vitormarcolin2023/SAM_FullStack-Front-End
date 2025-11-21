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

  projetos: Projeto[] = [];
  filtroNome = new FormControl('');              
  filtroPeriodo = new FormControl<string | null>(null);

  periodosDisponiveis = [
  { value: '1º Período', label: '1º Período' },
  { value: '2º Período', label: '2º Período' },
  { value: '3º Período', label: '3º Período' },
  { value: '4º Período', label: '4º Período' },
  { value: '5º Período', label: '5º Período' },
  { value: '6º Período', label: '6º Período' },
  { value: '7º Período', label: '7º Período' },
  { value: '8º Período', label: '8º Período' },
  { value: '9º Período', label: '9º Período' },
  { value: '10º Período', label: '10º Período' },
];

  modalRef: MdbModalRef<ProjetoDetalhesComponent> | null = null;

  ngOnInit() {
    this.carregarProjetos();

    this.filtroNome.valueChanges.subscribe(() => this.aplicarFiltros());
    this.filtroPeriodo.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  carregarProjetos() {
    this.projetoService.findAll().subscribe((projs) => (this.projetos = projs));
  }

  aplicarFiltros() {
    const nome = this.filtroNome.value?.trim() || '';
    const periodo = this.filtroPeriodo.value;

    // Somente período
    if (periodo && !nome) {
      this.projetoService.buscarPorPeriodo(periodo)
        .subscribe(projs => this.projetos = projs);
      return;
    }

    // Somente nome
    if (nome && !periodo) {
      this.projetoService.buscarPorNome(nome)
        .subscribe(projs => this.projetos = projs);
      return;
    }

    // Nome + período
    if (nome && periodo) {
      this.projetoService.buscarPorPeriodo(periodo)
        .subscribe(projs => {
          this.projetos = projs.filter(p =>
            p.nomeDoProjeto.toLowerCase().includes(nome.toLowerCase())
          );
        });
      return;
    }

    // Sem filtro
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
    this.filtroPeriodo.setValue(null); 
    this.carregarProjetos();
  }

  trackByProjetoId(index: number, projeto: Projeto): number | undefined {
    return projeto.id;
  }
}