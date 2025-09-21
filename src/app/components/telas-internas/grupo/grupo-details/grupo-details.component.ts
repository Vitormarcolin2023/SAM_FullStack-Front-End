import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarTelasInternasComponent } from '../../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
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
  // ❗ IMPORTANTE: Substitua '1' pela sua lógica real para obter o ID do aluno logado!
  loggedInAlunoId: number = 1;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Propriedades para o modal de edição
  showEditModal: boolean = false;
  grupoEditData = { nome: '' };

  constructor(private grupoService: GrupoService) {}

  ngOnInit(): void {
    this.carregarGrupo();
  }

  carregarGrupo(): void {
    this.isLoading = true;
    this.errorMessage = null;

    if (!this.loggedInAlunoId) {
      this.errorMessage = 'ID do aluno não encontrado. Faça o login.';
      this.isLoading = false;
      return;
    }

    this.grupoService.getGrupoByAlunoId(this.loggedInAlunoId).subscribe({
      next: (data) => {
        this.grupo = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          'Erro ao buscar as informações. Você já faz parte de um grupo?';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  isUserAdmin(): boolean {
    return this.grupo?.alunoAdmin?.id === this.loggedInAlunoId;
  }

  solicitarExclusaoAluno(aluno: Aluno): void {
    if (!this.isUserAdmin() || !this.grupo) return;

    if (aluno.id === this.loggedInAlunoId) {
      alert('O administrador não pode remover a si mesmo.');
      return;
    }

    // ✅ ADICIONE ESTA VERIFICAÇÃO
    if (!aluno.id) {
      alert(`Não foi possível encontrar o ID do aluno ${aluno.nome}.`);
      return;
    }

    const confirmacao = confirm(
      `Tem certeza que deseja solicitar a exclusão de ${aluno.nome}?`
    );
    if (confirmacao) {
      // Agora o TypeScript sabe que 'aluno.id' é um número
      this.grupoService.excluirAluno(this.loggedInAlunoId, aluno.id).subscribe({
        next: (response) => {
          alert(response);
          this.carregarGrupo();
        },
        error: (err) => {
          alert(`Erro: ${err.error}`);
          console.error(err);
        },
      });
    }
  }

  abrirModalEdicao(): void {
    if (!this.grupo) return;
    this.grupoEditData.nome = this.grupo.nome;
    this.showEditModal = true;
  }

  fecharModalEdicao(): void {
    this.showEditModal = false;
  }

  salvarAlteracoes(): void {
    // A verificação `!this.grupo.id` foi adicionada aqui.
    if (!this.grupo || !this.grupo.id || !this.isUserAdmin()) {
      alert(
        'Operação não permitida. A identificação do grupo não foi encontrada.'
      );
      return; // A execução para aqui se o ID não existir
    }

    // Agora o TypeScript tem certeza que 'this.grupo.id' é um número
    this.grupoService
      .atualizarGrupo(this.grupo.id, this.loggedInAlunoId, this.grupoEditData)
      .subscribe({
        next: (response) => {
          alert(response);
          this.carregarGrupo();
          this.fecharModalEdicao();
        },
        error: (err) => {
          alert(`Erro ao atualizar: ${err.error}`);
          console.error(err);
        },
      });
  }
}
