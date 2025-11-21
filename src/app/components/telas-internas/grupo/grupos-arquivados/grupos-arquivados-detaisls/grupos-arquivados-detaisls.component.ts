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

  isLoading: boolean = true; 
  
  alunoService = inject(AlunoService);
  private authSubscription: Subscription | undefined;
  
 
  alunoSemGrupo: boolean = false; 

  ngOnInit(): void {
   
    this.authSubscription = this.alunoService.alunoLogado$.subscribe(
      (aluno) => {
        if (aluno && aluno.id) {
          this.loggedInAlunoId = aluno.id;
        }
        this.isLoading = false; 
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  isUserAdmin(): boolean {
    return (
      !!this.loggedInAlunoId &&
      this.grupo?.alunoAdmin?.id === this.loggedInAlunoId
    );
  }

}
