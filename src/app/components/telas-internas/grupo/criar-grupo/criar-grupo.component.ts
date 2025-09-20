import { Component, signal } from '@angular/core';
import { NavbarTelasInternasComponent } from "../../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../../design/sidebar/sidebar.component";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { GrupoDto } from '../../../../models/grupo/grupo';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-criar-grupo',
  imports: [NavbarTelasInternasComponent, SidebarComponent, FormsModule, HttpClientModule],
  templateUrl: './criar-grupo.component.html',
  styleUrl: './criar-grupo.component.scss',
  standalone: true
})

export class CriarGrupoComponent {

  constructor(private grupoService: GrupoService) { }

  abrirModal() {
    Swal.fire({
      title: 'Criar Novo Grupo',
      html: `
        <div style="display: flex; flex-direction: column; gap: 8px; text-align: left;">
          <label for="group-name">Nome do Grupo</label>
          <input id="group-name" type="text" class="swal2-input" placeholder="Digite o nome do grupo" />

          <label for="aluno-admin-id">ID do Aluno Administrador</label>
          <input id="aluno-admin-id" type="number" class="swal2-input" placeholder="Digite o ID do aluno admin" />

          <label for="alunos-ids">IDs dos Alunos (separados por vírgula)</label>
          <input id="alunos-ids" type="text" class="swal2-input" placeholder="Ex: 1, 2, 3" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Criar Grupo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'rgb(28, 232, 151)',
      cancelButtonColor: '#a3a3a3ff',
      reverseButtons: true,
      preConfirm: () => {
        const groupName = (document.getElementById('group-name') as HTMLInputElement).value;
        const alunoAdminId = (document.getElementById('aluno-admin-id') as HTMLInputElement).value;
        const alunosIdsString = (document.getElementById('alunos-ids') as HTMLInputElement).value;

        if (!groupName || !alunoAdminId || !alunosIdsString) {
          Swal.showValidationMessage('Por favor, preencha todos os campos');
          return false;
        }

        const alunosIds = alunosIdsString.split(',').map(id => parseInt(id.trim(), 10));

        const novoGrupoDTO: GrupoDto = {
          nome: groupName,
          alunoAdminId: parseInt(alunoAdminId, 10),
          alunosIds: alunosIds
        };
        return novoGrupoDTO;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.grupoService.criarGrupo(result.value as GrupoDto).subscribe({
          next: (response: string) => { // Tipagem explícita para o 'response'
            console.log('Grupo criado com sucesso!', response);
            Swal.fire({
              icon: 'success',
              title: 'Grupo criado com sucesso!',
              confirmButtonColor: 'rgb(28, 232, 151)'
            });
          },
          error: (error: any) => {
            console.error('Erro ao criar o grupo', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro ao criar o grupo',
              text: 'Por favor, tente novamente.',
              confirmButtonColor: 'rgb(255, 0, 0)'
            });
          }
        });
      }
    });
  }
}