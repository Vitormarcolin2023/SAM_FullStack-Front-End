import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Grupo } from '../../../../../models/grupo/grupo';
import { AlunoService } from '../../../../../services/alunos/alunos.service';

@Component({
  selector: 'app-grupos-arquivados-detaisls',
  imports: [CommonModule, FormsModule],
  templateUrl: './grupos-arquivados-detaisls.component.html',
  styleUrl: './grupos-arquivados-detaisls.component.scss'
})
export class GruposArquivadosDetaislsComponent {
  @Input() grupo: Grupo | null = null;

  loggedInAlunoId: number | null = null;
  // O grupo é carregado via Input, então o loading é rápido
  isLoading: boolean = true; 
  
  alunoService = inject(AlunoService);
  private authSubscription: Subscription | undefined;
  
  // Variável dummy para evitar erros de referência se o template ainda as usar
  alunoSemGrupo: boolean = false; 

  ngOnInit(): void {
    // Carrega o ID do aluno logado apenas para checar se ele é o "Líder" (para fins de exibição)
    this.authSubscription = this.alunoService.alunoLogado$.subscribe(
      (aluno) => {
        if (aluno && aluno.id) {
          this.loggedInAlunoId = aluno.id;
        }
        // O grupo é passado, então o carregamento está completo.
        this.isLoading = false; 
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  isUserAdmin(): boolean {
    // Retorna se o usuário logado é o admin, apenas para fins de visualização do selo "Líder"
    return (
      !!this.loggedInAlunoId &&
      this.grupo?.alunoAdmin?.id === this.loggedInAlunoId
    );
  }

}
