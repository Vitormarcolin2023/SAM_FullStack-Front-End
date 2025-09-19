import { Component, inject } from '@angular/core';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { TokenDecode } from '../../../models/token/token-decode';
import { LoginService } from '../../../services/login.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tela-inicial',
  imports: [SidebarComponent, NavbarTelasInternasComponent, RouterOutlet],
  templateUrl: './tela-inicial.component.html',
  styleUrl: './tela-inicial.component.scss'
})
export class TelaInicialComponent {
    
  tokenService = inject(TokenDecode);

  userRole = this.tokenService.getRole();

  ngOnInit(){
    console.log(this.userRole);
  }

}
