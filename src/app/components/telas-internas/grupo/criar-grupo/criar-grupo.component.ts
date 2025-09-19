import { Component, signal } from '@angular/core';
import { NavbarTelasInternasComponent } from "../../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../../design/sidebar/sidebar.component";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar-grupo',
  imports: [NavbarTelasInternasComponent, SidebarComponent, FormsModule],
  templateUrl: './criar-grupo.component.html',
  styleUrl: './criar-grupo.component.scss',
  standalone: true
})

export class CriarGrupoComponent {
  abrirModal() {
    Swal.fire({
      title: 'Criar Novo Grupo',
      html: `
        <div style="display: flex; flex-direction: column; gap: 8px; text-align: left;">

          <label for="group-name">Nome do Grupo</label>
          <input id="group-name" type="text" class="swal2-input" placeholder="Digite o nome do grupo" />

          <label for="students-count">Quantidade de Alunos (2-5)</label>
          <select id="students-count" class="swal2-select">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <label for="course">Curso</label>
          <input id="course" type="text" class="swal2-input" placeholder="Digite o curso" />

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
        const studentsCount = (document.getElementById('students-count') as HTMLSelectElement).value;
        const course = (document.getElementById('course') as HTMLInputElement).value;

        if (!groupName || !studentsCount || !course) {
          Swal.showValidationMessage('Por favor, preencha todos os campos');
          return false;
        }

        return { groupName, studentsCount, course };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Grupo criado com sucesso!',
          confirmButtonColor: 'rgb(28, 232, 151)'
        });
      }
    });
  }
}
