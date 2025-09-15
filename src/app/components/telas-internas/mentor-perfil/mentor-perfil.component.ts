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

  fotoUrl: string = ''; // Pode começar vazio e o usuário faz upload
  nome: string = 'Nome do Mentor';
  area: string = 'Área de Atuação';
  resumo: string = 'Escreva aqui um breve resumo sobre o mentor.';

   // Método para trocar foto
  onFotoSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoUrl = URL.createObjectURL(file);
    }
  }
}