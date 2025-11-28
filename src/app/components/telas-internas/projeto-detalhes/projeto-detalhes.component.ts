import { Component, inject, Input, OnInit } from '@angular/core';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
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

  constructor(public modalRef: MdbModalRef<ProjetoDetalhesComponent>) {}

   @Input() projeto!: Projeto;

    private route = inject(ActivatedRoute);
    private projetoService = inject(ProjetoService);
    private router = inject(Router);
    tokenService = inject(TokenDecode);
   
ngOnInit(): void {
  
     this.userRole = this.tokenService.getRole();
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.projetoService.findById(id).subscribe((res) => {
        this.projeto = res;
      });
        }
  }
   userRole = this.tokenService.getRole();
  voltar() {
    this.modalRef.close();
  }
 
 arquivarProjeto() {
  const id = this.projeto?.id;
  console.log("ID que vai ser enviado:", id);

  if (!id || id <= 0) {
    alert("ID do projeto inválido.");
    return;
  }

  const confirmado = confirm("Tem certeza que deseja arquivar este projeto?");
  if (confirmado) {
    this.projetoService.arquivar(id).subscribe({
      next: () => alert("Projeto arquivado com sucesso."),
      error: (err) => {
        alert("Erro ao arquivar o projeto.");
        console.error(err);
      }
    });
  }
}


editarProjeto() {
  const id = this.projeto?.id;
  if (id !== undefined) {
     this.modalRef.close();
    this.router.navigate(['/editar-projeto', id]);
  } else {
    alert('ID do projeto não encontrado. Não é possível editar.');
  }
}
}

