import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MentorService } from '../../../../services/mentores/mentores.service';
import { Mentor } from '../../../../models/mentor/mentor';
import { Projeto } from '../../../../models/projeto/projeto';
import { NavbarTelasInternasComponent } from '../../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import { ProjetoService } from '../../../../services/projeto/projeto.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ProjetoDetalhesComponent } from '../../projeto-detalhes/projeto-detalhes.component';

@Component({
  selector: 'app-projetos-mentor',
  imports: [NavbarTelasInternasComponent, SidebarComponent, CommonModule, MdbModalModule, ProjetoDetalhesComponent],
  templateUrl: './projetos-mentor.component.html',
  styleUrl: './projetos-mentor.component.scss',
})
export class ProjetosMentorComponent {

  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<ProjetoDetalhesComponent>;
   @ViewChild('projetoDetalhe') projetoDetalhe!: TemplateRef<any>;

  mentorService = inject(MentorService);
  projetoService = inject(ProjetoService);
  mentor!: Mentor;
  projetos: Projeto[] = [];
  mentorId!: number;

  ngOnInit() {
    this.buscarMentor();
  }

  buscarMentor() {
    this.mentorService.getMyProfile().subscribe({
      next: (mentor) => {
        console.log(mentor);
        if (mentor.id) {
          this.mentorId = mentor.id;
          this.buscarProjetos();
        }
      },
      error: (erro) => {
        Swal.fire('Mentor não encontrado!', erro.error.message, 'error');
      },
    });
  }

  buscarProjetos() {
    this.projetoService.findByMentor(this.mentorId).subscribe({
      next: (data) => {
        this.projetos = data;
      },
      error: (err) => {
        console.log(err);
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
