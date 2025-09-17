import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";

@Component({
  selector: 'app-mentor-perfil',
  standalone: true,
  imports: [CommonModule, NavbarTelasInternasComponent, SidebarComponent],
  templateUrl: './mentor-perfil.component.html',
  styleUrls: ['./mentor-perfil.component.scss']
})
export class MentorPerfilComponent {

  // Dados do mentor
  fotoUrl: string = ''; 
  nome: string = 'Nome do Mentor';
  area: string = 'Área de Atuação';
  resumo: string = 'Escreva aqui um breve resumo sobre o mentor.';

  /**
   * Método para trocar a foto do mentor.
   * Atualiza a URL de exibição após o upload.
   */
  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fotoUrl = URL.createObjectURL(file);
    }
  }
}
