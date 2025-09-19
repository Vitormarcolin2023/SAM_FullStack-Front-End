import { Component, signal } from '@angular/core';
import { NavbarTelasInternasComponent } from "../../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../../design/sidebar/sidebar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-criar-grupo',
  imports: [NavbarTelasInternasComponent, SidebarComponent, FormsModule],
  templateUrl: './criar-grupo.component.html',
  styleUrl: './criar-grupo.component.scss',
  standalone: true
})
export class CriarGrupoComponent {
  groupName = signal('');
  projectName = signal('');
  description = signal('');
  objectives = signal('');
  startDate = signal('');
  endDate = signal('');

  
  onSubmit() {
    const newGroup = {
      groupName: this.groupName(),
      projectName: this.projectName(),
      description: this.description(),
      objectives: this.objectives(),
      startDate: this.startDate(),
      endDate: this.endDate()
    };
    
    // Simulação do envio de dados
    console.log('Novo grupo criado:', newGroup);
    
    // Você pode adicionar a lógica para enviar esses dados para um serviço aqui.
    // Exemplo: this.groupService.createGroup(newGroup);
    
    alert('Grupo criado com sucesso!');
  }


}
