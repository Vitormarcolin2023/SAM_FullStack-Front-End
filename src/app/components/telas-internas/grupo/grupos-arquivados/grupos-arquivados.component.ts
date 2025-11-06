import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NavbarTelasInternasComponent } from '../../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import { Aluno } from '../../../../models/aluno/aluno';
import { Grupo } from '../../../../models/grupo/grupo';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import Swal from 'sweetalert2';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { CommonModule } from '@angular/common';
import { GrupoDetailsComponent } from "../grupo-details/grupo-details.component";
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { GruposArquivadosDetaislsComponent } from "./grupos-arquivados-detaisls/grupos-arquivados-detaisls.component";


@Component({
  selector: 'app-grupos-arquivados',
  imports: [NavbarTelasInternasComponent, SidebarComponent, CommonModule, GrupoDetailsComponent, MdbModalModule, GruposArquivadosDetaislsComponent],
  templateUrl: './grupos-arquivados.component.html',
  styleUrl: './grupos-arquivados.component.scss',
})
export class GruposArquivadosComponent {
  alunoLogado!: Aluno;
  alunoService = inject(AlunoService);
  grupoService = inject(GrupoService);
  grupos: Grupo[] = [];
  semGrupo = false;

  modalService = inject(MdbModalService);
  @ViewChild('grupoDetalhes') grupoDetalhes!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  grupoSelecionado!: Grupo;

  ngOnInit() {
    this.getAlunoLogado();
  }

  getAlunoLogado() {
    this.alunoService.getMyProfile().subscribe({
      next: (aluno) => {
        this.alunoLogado = aluno;
        if (aluno.id) {
          this.getGruposArquivados(aluno.id);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar aluno logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
      },
    });
  }

  getGruposArquivados(alunoId: number) {
    this.grupoService.getGruposArquivados(alunoId).subscribe({
      next: (grupos) => {
        console.log(grupos);
        this.grupos = grupos;
      },
      error: (err) => {
        this.semGrupo = true;
      },
    });
  }

  visualizarGrupo(grupo: Grupo) {
    this.grupoSelecionado = grupo; 
    this.modalRef = this.modalService.open(this.grupoDetalhes, {
      
    });
  }
}
