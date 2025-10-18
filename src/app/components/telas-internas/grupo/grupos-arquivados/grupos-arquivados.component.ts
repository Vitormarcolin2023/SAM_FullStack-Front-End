import { Component, inject } from '@angular/core';
import { NavbarTelasInternasComponent } from '../../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import { Aluno } from '../../../../models/aluno/aluno';
import { Grupo } from '../../../../models/grupo/grupo';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import Swal from 'sweetalert2';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupos-arquivados',
  imports: [NavbarTelasInternasComponent, SidebarComponent, CommonModule],
  templateUrl: './grupos-arquivados.component.html',
  styleUrl: './grupos-arquivados.component.scss',
})
export class GruposArquivadosComponent {
  alunoLogado!: Aluno;
  alunoService = inject(AlunoService);
  grupoService = inject(GrupoService);
  grupos: Grupo[] = [];
  semGrupo = false;

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
}
