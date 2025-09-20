import { Component } from '@angular/core';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-aluno-principal',
  imports: [NavbarTelasInternasComponent, SidebarComponent, RouterOutlet],
  templateUrl: './aluno-principal.component.html',
  styleUrl: './aluno-principal.component.scss'
})
export class AlunoPrincipalComponent {

}
