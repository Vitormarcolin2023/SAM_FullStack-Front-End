import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { TokenDecode } from '../../../models/token/token-decode';
import { GrupoDetailsComponent } from '../grupo/grupo-details/grupo-details.component';

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [SidebarComponent, NavbarTelasInternasComponent, GrupoDetailsComponent],
  templateUrl: './tela-inicial.component.html',
  styleUrl: './tela-inicial.component.scss'
})
export class TelaInicialComponent {
  tokenService = inject(TokenDecode);
  userRole = this.tokenService.getRole();

  @ViewChild('visuGrupo', { read: ViewContainerRef }) visuGrupo!: ViewContainerRef;

  acessarGrupo() {
    this.visuGrupo.clear();
    this.visuGrupo.createComponent(GrupoDetailsComponent);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
  }
}
