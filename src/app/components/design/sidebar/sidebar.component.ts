import { Component, EventEmitter, Output, inject } from '@angular/core';
import { TokenDecode } from '../../../models/token/token-decode';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  tokenService = inject(TokenDecode);
  router = inject(Router);
  userId: number | null = null;
  userEmail: string | null = null;

  ngOnInit(): void {
    this.userRole = this.tokenService.getRole();
    this.userId = this.tokenService.getId();
    this.userEmail = this.tokenService.getEmail();
  }

  userRole = this.tokenService.getRole();

  @Output() grupoSelecionado = new EventEmitter<void>();

  acessarGrupo() {
    this.grupoSelecionado.emit();
  }

  // criar uma função com switch case para redirecionamento correto de rotas conforme o usuário
  userPerfil() {
    switch (this.userRole) {
      case 'ALUNO':
        this.router.navigate(['/aluno/aluno-perfil']);
        break;
      case 'COORDENADOR':
        this.router.navigate(['/coordenador-perfil'])
        break;
      case 'MENTOR':
        this.router.navigate(["/mentor-perfil"]);
      break;
      case 'PROFESSOR':
        break;
    }
  }

  atualizarPerfil() {
    switch (this.userRole) {
      case 'ALUNO':
        if (this.userEmail) {
          this.router.navigate(['/aluno/aluno-editar', this.userEmail]);
        }
        break;
      case 'COORDENADOR':
      this.router.navigate(['/cadastro-coordenacao']);
      break;
      case 'MENTOR':
        this.router.navigate(["/editar-mentor"]);

      break;
      case 'PROFESSOR':
        break;
    }
  }

  visualizarProjetos() {
    switch (this.userRole) {
      case 'ALUNO':
        this.router.navigate(['/tela-inicial/visualizar-projetos']);
        break;
      case 'COORDENADOR':
        break;
      case 'MENTOR':
        this.router.navigate(['/mentor/visualizar-projetos'])
        break;
      case 'PROFESSOR':
        break;
    }
  }
}
 