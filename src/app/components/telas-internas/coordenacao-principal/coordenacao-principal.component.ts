import { Component } from '@angular/core';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-coordenacao-principal',
  imports: [SidebarComponent, RouterModule],
  templateUrl: './coordenacao-principal.component.html',
  styleUrl: './coordenacao-principal.component.scss'
})
export class CoordenacaoPrincipalComponent {

}
