import { Component, inject } from '@angular/core';
import { TokenDecode } from '../../../models/token/token-decode';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  tokenService = inject(TokenDecode);

  userRole = this.tokenService.getRole();

}
