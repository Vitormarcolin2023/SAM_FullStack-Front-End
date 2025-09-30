import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Grupo } from '../../../../models/grupo/grupo';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { Aluno } from '../../../../models/aluno/aluno';
// AQUI COMEÇOU A ALTERAÇÃO
import { Subscription } from 'rxjs';
import { AlunoService } from '../../../../services/alunos/alunos.service';
// AQUI FINALIZOU A ALTERAÇÃO

@Component({
  selector: 'app-grupo-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupo-details.component.html',
  styleUrls: ['./grupo-details.component.scss'],
})
export class GrupoDetailsComponent implements OnInit, OnDestroy {
  grupo: Grupo | null = null;
  loggedInAlunoId: number | null = null;
  isLoading: boolean = true;
  alunoSemGrupo: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private grupoService: GrupoService,
    // AQUI COMEÇOU A ALTERAÇÃO
    private alunoService: AlunoService // INJETANDO AlunoService
    // AQUI FINALIZOU A ALTERAÇÃO
  ) {}

  ngOnInit(): void {
    console.log('[DEBUG] Componente GrupoDetails iniciado (ngOnInit).');
    this.isLoading = true;

    // AQUI COMEÇOU A ALTERAÇÃO
    // Se inscreve no observable do AlunoService
    this.authSubscription = this.alunoService.alunoLogado$.subscribe(aluno => {
    // AQUI FINALIZOU A ALTERAÇÃO
      if (aluno && aluno.id) {
        console.log(`[DEBUG] Aluno autenticado recebido: ID ${aluno.id}`);
        this.loggedInAlunoId = aluno.id;
        this.carregarGrupo();
      } else {
        console.log('[DEBUG] Nenhum aluno autenticado encontrado.');
        this.isLoading = false;
        this.exibirModalErro('Não foi possível identificar o usuário. Por favor, faça o login novamente.');
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  // ... O restante do seu arquivo .ts permanece exatamente o mesmo ...
  // (carregarGrupo, isUserAdmin, solicitarExclusaoAluno, exibirModalErro, etc.)

  carregarGrupo(): void {
    if (!this.loggedInAlunoId) return;

    console.log(
      `[DEBUG] Iniciando carregamento do grupo para o aluno ID: ${this.loggedInAlunoId}`
    );
    this.isLoading = true;
    this.alunoSemGrupo = false;

    this.grupoService.getGrupoByAlunoId(this.loggedInAlunoId).subscribe({
      next: (data) => {
        this.grupo = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[DEBUG] OCORREU UM ERRO na chamada da API:', err);
        if (err.status === 404) {
          this.alunoSemGrupo = true;
        } else {
          this.exibirModalErro(err);
        }
        this.isLoading = false;
      },
    });
  }

  isUserAdmin(): boolean {
    return !!this.loggedInAlunoId && this.grupo?.alunoAdmin?.id === this.loggedInAlunoId;
  }

  solicitarExclusaoAluno(aluno: Aluno): void {
     if (!this.isUserAdmin() || !this.grupo || !this.grupo.id || !this.loggedInAlunoId) {
       this.exibirModalErro('Ação não permitida.');
       return;
     }
     if (aluno.id === this.loggedInAlunoId) {
       this.exibirModalErro('O administrador não pode remover a si mesmo.');
       return;
     }
     if (!aluno.id) {
       this.exibirModalErro(
         `Não foi possível encontrar o ID do aluno ${aluno.nome}.`
       );
       return;
     }

     Swal.fire({
       title: 'Tem certeza?',
       text: `Você está prestes a remover ${aluno.nome} permanentemente do grupo.`,
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: 'rgb(28, 232, 151)',
       cancelButtonColor: '#9a9c9dff',
       confirmButtonText: 'Sim, remover!',
       cancelButtonText: 'Cancelar',
       reverseButtons: true,
     }).then((result) => {
       if (result.isConfirmed) {
         this.grupoService
           .removerAlunoDiretamente(
             this.grupo!.id!,
             aluno.id!,
             this.loggedInAlunoId!
           )
           .subscribe({
             next: (response) => {
               Swal.fire('Removido!', response, 'success');
               this.carregarGrupo();
             },
             error: (err) => this.exibirModalErro(err),
           });
       }
     });
   }

   abrirModalEdicao(): void {
     if (!this.grupo) return;

     Swal.fire({
       title: 'Editar Nome do Grupo',
       input: 'text',
       inputValue: this.grupo.nome,
       showCancelButton: true,
       confirmButtonText: 'Salvar',
       confirmButtonColor: 'rgb(28, 232, 151)',
       cancelButtonText: 'Cancelar',
         reverseButtons: true,
       inputValidator: (value) => {
         if (!value || value.trim() === '') {
           return 'Você precisa digitar um nome!';
         }
         return null;
       },
     }).then((result) => {
       if (result.isConfirmed && result.value) {
         this.salvarAlteracoes(result.value);
       }
     });
   }

   salvarAlteracoes(novoNome: string): void {
     if (!this.grupo || !this.grupo.id || !this.isUserAdmin() || !this.loggedInAlunoId) {
       this.exibirModalErro('Operação não permitida.');
       return;
     }

     const dadosParaAtualizar = { nome: novoNome };

     this.grupoService
       .atualizarGrupo(this.grupo.id, this.loggedInAlunoId, dadosParaAtualizar)
       .subscribe({
         next: (response) => {
           Swal.fire('Sucesso!', response, 'success');
           this.carregarGrupo();
         },
         error: (err) => this.exibirModalErro(err),
       });
   }

  private exibirModalErro(error: any): void {
    let mensagem: string;

    if (typeof error === 'string') {
      mensagem = error;
    } else {
      mensagem =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        'Ocorreu um erro inesperado.';
    }
    
    console.log(`[DEBUG] Exibindo modal de erro com a mensagem: "${mensagem}"`);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensagem,
    });
  }
}