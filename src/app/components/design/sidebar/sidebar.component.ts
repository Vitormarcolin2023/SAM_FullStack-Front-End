import { Component, inject } from '@angular/core';
import { TokenDecode } from '../../../models/token/token-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  tokenService = inject(TokenDecode);
  router = inject(Router);

  userRole = this.tokenService.getRole();

}
