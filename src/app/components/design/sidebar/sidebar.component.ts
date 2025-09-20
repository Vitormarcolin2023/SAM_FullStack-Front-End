import { Component, EventEmitter, Output, inject } from '@angular/core';
import { TokenDecode } from '../../../models/token/token-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  tokenService = inject(TokenDecode);
<<<<<<< HEAD
  router = inject(Router);

=======
>>>>>>> ccb95e0956c81cb7818570fd14ba00a8b6b8a14b
  userRole = this.tokenService.getRole();

  @Output() grupoSelecionado = new EventEmitter<void>();

  acessarGrupo() {
    this.grupoSelecionado.emit(); // dispara o evento para o pai
  }
}
