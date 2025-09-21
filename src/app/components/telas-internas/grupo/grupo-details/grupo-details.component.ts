import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarTelasInternasComponent } from '../../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import Swal from 'sweetalert2';
import { Grupo } from '../../../../models/grupo/grupo';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { Aluno } from '../../../../models/aluno/aluno';

@Component({
  selector: 'app-grupo-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarTelasInternasComponent,
    SidebarComponent,
  ],
  templateUrl: './grupo-details.component.html',
  styleUrls: ['./grupo-details.component.scss'],
})
export class GrupoDetailsComponent implements OnInit {
  grupo: Grupo | null = null;
  loggedInAlunoId: number = 1;
  isLoading: boolean = true;

  constructor(private grupoService: GrupoService) {}

  ngOnInit(): void {
    this.carregarGrupo();
  }

  carregarGrupo(): void {
    this.isLoading = true;
    if (!this.loggedInAlunoId) {
      this.exibirModalErro('ID do aluno não encontrado. Faça o login.');
      this.isLoading = false;
      return;
    }

    this.grupoService.getGrupoByAlunoId(this.loggedInAlunoId).subscribe({
      next: (data) => {
        this.grupo = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.exibirModalErro(
          'Erro ao buscar as informações. Verifique se você faz parte de um grupo.'
        );
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  isUserAdmin(): boolean {
    return this.grupo?.alunoAdmin?.id === this.loggedInAlunoId;
  }

  solicitarExclusaoAluno(aluno: Aluno): void {
    if (!this.isUserAdmin() || !this.grupo || !this.grupo.id) return;
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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.grupoService
          .removerAlunoDiretamente(
            this.grupo!.id!,
            aluno.id!,
            this.loggedInAlunoId
          )
          .subscribe({
            next: (response) => {
              Swal.fire('Removido!', response, 'success');
              this.carregarGrupo();
            },
            error: (err) =>
              this.exibirModalErro(err.error?.message || err.error),
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
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
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
    if (!this.grupo || !this.grupo.id || !this.isUserAdmin()) {
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
        error: (err) => this.exibirModalErro(err.error?.message || err.error),
      });
  }

  private exibirModalErro(mensagem: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensagem || 'Ocorreu um erro inesperado.',
    });
  }
}
