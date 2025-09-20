import { Component } from '@angular/core';
import { NavbarTelasInternasComponent } from "../../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../../design/sidebar/sidebar.component";

@Component({
  selector: 'app-grupo-details',
  imports: [NavbarTelasInternasComponent, SidebarComponent],
  templateUrl: './grupo-details.component.html',
  styleUrl: './grupo-details.component.scss'
})
export class GrupoDetailsComponent {

}
