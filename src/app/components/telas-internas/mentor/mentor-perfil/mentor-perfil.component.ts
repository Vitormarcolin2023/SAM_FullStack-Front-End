import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Mentor } from '../../../../models/mentor/mentor';
import { MentorService } from '../../../../services/mentores/mentores.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { MentorEditComponent } from '../mentor-edit/mentor-edit.component';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-mentor-perfil',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MdbModalModule
],
  templateUrl: './mentor-perfil.component.html',
  styleUrls: ['./mentor-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MentorPerfilComponent implements OnInit {
  mentor!: Mentor;
  mentorEdit!: Mentor;

  router = inject(Router);
  mentorService = inject(MentorService);

  ngOnInit(): void {
    this.mentorService.getMyProfile().subscribe({
      next: (mentor) => {
        this.mentor = mentor;
      },
      error: (erro) => {
        Swal.fire('Mentor não encontrado!', erro.error.message, 'error');
      },
    });
  }


  editarInfos(): void {
    if (!this.mentor) {
      Swal.fire('Erro', 'Mentor não carregado ainda.', 'error');
      return;
    }

    Swal.fire({
      title: 'Editar Informações',
      html: `
      <textarea id="swal-resumo" class="swal2-textarea"
        placeholder="Escreva aqui um breve resumo sobre suas experiências">
        ${this.mentor.resumo || ''}
      </textarea>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const resumo = (
          document.getElementById('swal-resumo') as HTMLTextAreaElement
        )?.value.trim();
        return { resumo };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const resumoAtualizado = result.value.resumo;

        this.mentorService
          .update({ ...this.mentor, resumo: resumoAtualizado })
          .subscribe({
            next: (mentorAtualizado) => {
              this.mentor = mentorAtualizado;
              Swal.fire(
                'Salvo!',
                'As informações foram atualizadas.',
                'success'
              );
            },
            error: (erro: any) => {
              Swal.fire(
                'Erro',
                erro?.error?.message || 'Erro ao atualizar',
                'error'
              );
            },
          });
      }
    });
  }

  editarInformacoes() {
    this.router.navigate(['/editar-mentor']);
  }

  excluirConta() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.mentor.id) {
          Swal.fire('Erro', 'ID do mentor não encontrado.', 'error');
          return;
        }
        let id = this.mentor.id;

        this.mentorService
          .desvincularProjetos(this.mentor.id)
          .pipe(switchMap(() => this.mentorService.delete(id)))
          .subscribe({
            next: () => {
              Swal.fire(
                'Deletado!',
                'Sua conta foi removida com sucesso.',
                'success'
              );
              this.router.navigate(['/login']);
            },
            error: (res) =>
              Swal.fire(
                'Erro',
                res || 'Não foi possível deletar a conta',
                'error'
              ),
          });
      }
    });
  }

  /*
  editarMinicurriculo(): void {
    Swal.fire({
      title: 'Editar Minicurrículo',
      html: `
        <textarea id="swal-minicurriculo" class="swal2-textarea" placeholder="Escreva aqui o seu minicurrículo">${this.minicurriculo || ''}</textarea>
        <div id="char-count" style="text-align:right; font-size:0.8rem; color:#888; margin-top:4px;">${this.minicurriculo ? this.minicurriculo.length : 0}/100</div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const textarea = document.getElementById('swal-minicurriculo') as HTMLTextAreaElement;
        const value = textarea.value.trim();
        if (value.length < 100) {
          Swal.showValidationMessage(`O minicurrículo deve ter pelo menos 100 caracteres (${value.length}/100)`);
          return false;
        }
        return value;
      },
      didOpen: () => {
        const textarea = document.getElementById('swal-minicurriculo') as HTMLTextAreaElement;
        const charCount = document.getElementById('char-count') as HTMLDivElement;

        textarea.addEventListener('input', () => {
          charCount.textContent = `${textarea.value.length}/100`;
        });
      }
    }).then(result => {
      if (result.isConfirmed && result.value !== undefined) {
        this.minicurriculo = result.value;
        Swal.fire('Salvo!', 'O minicurrículo foi atualizado.', 'success');
      }
    });
  }
    */
}
