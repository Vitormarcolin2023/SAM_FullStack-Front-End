import { Component } from '@angular/core';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { ɵɵRouterOutlet } from "@angular/router/testing";

@Component({
  selector: 'app-professor-principal',
  imports: [SidebarComponent, ɵɵRouterOutlet],
  templateUrl: './professor-principal.component.html',
  styleUrl: './professor-principal.component.scss'
})
export class ProfessorPrincipalComponent {

}
