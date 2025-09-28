import { Component, inject, Input, OnInit } from '@angular/core';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { ActivatedRoute } from '@angular/router';
import { ProjetoService } from '../../../services/projeto/projeto.service';
<<<<<<< Updated upstream
import { NavbarComponent } from '../../design/navbar/navbar.component';
=======
import { Router } from '@angular/router';
>>>>>>> Stashed changes

@Component({
  selector: 'app-projeto-detalhes',
  templateUrl: './projeto-detalhes.component.html',
  styleUrl: './projeto-detalhes.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class ProjetoDetalhesComponent implements OnInit {
  projeto!: Projeto;

    private route = inject(ActivatedRoute);
    private projetoService = inject(ProjetoService);
    private router = inject(Router);
   
ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.projetoService.findById(id).subscribe((res) => {
        this.projeto = res;
      });
        }
  }
  voltar() {
    this.router.navigate(['/visual-projeto']); 
  }
 
  deletarProjeto() {
  if (confirm('Tem certeza que deseja deletar este projeto?')) {
    const id = this.projeto?.id;
    if (id !== undefined) {
      this.projetoService.delete(id).subscribe({
        next: () => {
          alert('Projeto deletado com sucesso!');
          this.router.navigate(['/visual-projeto']);
        },
        error: (erro: unknown) => {
          alert('Erro ao deletar o projeto.');
          console.error(erro);
        }
      });
    } else {
      alert('ID do projeto não encontrado. Não foi possível deletar.');
    }
  }
}
editarProjeto() {
  const id = this.projeto?.id;
  if (id !== undefined) {
    this.router.navigate(['/editar-projeto', id]);
  } else {
    alert('ID do projeto não encontrado. Não é possível editar.');
  }
}
}


