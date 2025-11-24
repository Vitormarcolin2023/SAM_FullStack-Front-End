import { Component } from '@angular/core';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { ɵɵRouterOutlet } from "@angular/router/testing";

@Component({
  selector: 'app-avaliacoes',
  imports: [SidebarComponent, ɵɵRouterOutlet],
  templateUrl: './avaliacoes.component.html',
  styleUrl: './avaliacoes.component.scss'
})
export class AvaliacoesComponent {

}
