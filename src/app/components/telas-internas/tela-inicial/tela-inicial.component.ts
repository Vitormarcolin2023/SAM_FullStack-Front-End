import { Component, Inject, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { TokenDecode } from '../../../models/token/token-decode';
import { GrupoDetailsComponent } from '../grupo/grupo-details/grupo-details.component';
import { RouterOutlet } from '@angular/router';
import { Mentor } from '../../../models/mentor/mentor';
import { MentorService } from '../../../services/mentores/mentores.service';

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [SidebarComponent, NavbarTelasInternasComponent, RouterOutlet],
  templateUrl: './tela-inicial.component.html',
  styleUrl: './tela-inicial.component.scss'
})
export class TelaInicialComponent {
  tokenService = inject(TokenDecode);
  userRole = this.tokenService.getRole();
  
}
