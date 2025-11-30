import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Projeto } from '../../../models/projeto/projeto';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { TokenDecode } from '../../../models/token/token-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projeto-detalhes',
  templateUrl: './projeto-detalhes.component.html',
  styleUrl: './projeto-detalhes.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class ProjetoDetalhesComponent implements OnInit {
  // Injeções padronizadas (usando inject)
  private projetoService = inject(ProjetoService);
  private router = inject(Router);
  private tokenService = inject(TokenDecode);
  public modalRef = inject(MdbModalRef<ProjetoDetalhesComponent>);

  // Recebe o projeto PRONTO de quem abriu o modal
  @Input() projeto!: Projeto;
  
  userRole: string = '';

  ngOnInit(): void {
    this.userRole = this.tokenService.getRole() ?? '';
  
    if (!this.projeto) {
      console.warn('Modal aberto sem projeto!');

    }
  }

  voltar() {
    this.modalRef.close();
  }

  deletarProjeto() {
  // 1. Captura o ID numa constante local
  const id = this.projeto?.id;

  // 2. Verifica a constante
  if (!id) {
    Swal.fire('Erro', 'ID do projeto não encontrado.', 'error');
    return;
  }

  Swal.fire({
    title: 'Tem certeza?',
    text: "Deseja deletar este projeto?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, deletar!'
  }).then((result) => {
    if (result.isConfirmed) {
      // 3. Usa a constante 'id' aqui dentro.
      // O TypeScript sabe que 'id' é um numero, pois foi validado lá em cima.
      this.projetoService.delete(id).subscribe({
        next: () => {
          Swal.fire('Deletado!', 'O projeto foi deletado.', 'success');
          this.modalRef.close(true);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Erro!', 'Não foi possível deletar o projeto.', 'error');
        }
      });
    }
  });
}

  editarProjeto() {
    if (this.projeto?.id) {
      this.modalRef.close();
      // Aqui sim navegamos para uma rota
      this.router.navigate(['/editar-projeto', this.projeto.id]);
    } else {
      Swal.fire('Erro', 'ID não encontrado para edição.', 'error');
    }
  }
}