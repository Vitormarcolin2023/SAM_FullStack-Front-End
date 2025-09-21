import { Component } from '@angular/core';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-grupo',
  imports: [NavbarTelasInternasComponent, SidebarComponent, RouterOutlet],
  templateUrl: './grupo.component.html',
  styleUrl: './grupo.component.scss'
})
export class GrupoComponent {

}
