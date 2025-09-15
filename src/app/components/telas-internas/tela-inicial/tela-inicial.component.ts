import { Component } from '@angular/core';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";

@Component({
  selector: 'app-tela-inicial',
  imports: [SidebarComponent, NavbarTelasInternasComponent],
  templateUrl: './tela-inicial.component.html',
  styleUrl: './tela-inicial.component.scss'
})
export class TelaInicialComponent {

}
