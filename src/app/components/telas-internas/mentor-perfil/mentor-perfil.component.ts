import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mentor-perfil',
  standalone: true,
  imports: [CommonModule, NavbarTelasInternasComponent, SidebarComponent],
  templateUrl: './mentor-perfil.component.html',
  styleUrls: ['./mentor-perfil.component.scss']
})
export class MentorPerfilComponent {
  fotoUrl: string = '';
  nome: string = 'Nome do Mentor';
  area: string = 'Área de Atuação';
  resumo: string = 'Escreva aqui um breve resumo sobre o mentor.';

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fotoUrl = URL.createObjectURL(file);
    }
  }

  editarInfos(): void {
    Swal.fire({
      title: 'Editar Informações',
      html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${this.nome}">
        <input id="swal-area" class="swal2-input" placeholder="Área" value="${this.area}">
        <textarea id="swal-resumo" class="swal2-textarea" placeholder="Resumo">${this.resumo}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nome = (document.getElementById('swal-nome') as HTMLInputElement).value;
        const area = (document.getElementById('swal-area') as HTMLInputElement).value;
        const resumo = (document.getElementById('swal-resumo') as HTMLTextAreaElement).value;

        if (!nome || !area) {
          Swal.showValidationMessage('Nome e área são obrigatórios');
          return false;
        }

        return { nome, area, resumo };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.nome = result.value.nome;
        this.area = result.value.area;
        this.resumo = result.value.resumo;
        Swal.fire('Salvo!', 'As informações foram atualizadas.', 'success');
      }
    });
  }
}
