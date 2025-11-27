import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../design/sidebar/sidebar.component';
import { UserdataService } from '../../../services/coordenacao/userdata.service';
import { ProfessorService } from '../../../services/professor/professor.service';
import { CoordenadorService } from '../../../services/coordenacao/coordenador.service';
import Swal from 'sweetalert2';

import { Coordenador } from '../../../models/coordenacao/coordenador';
import { Professor } from '../../../models/professor/professor';
import { Curso } from '../../../models/curso/curso';
import { TokenDecode } from '../../../models/token/token-decode';

type UsuarioPerfil = Coordenador | Professor;

@Component({
  selector: 'app-funcionario-perfil',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './funcionario-perfil.component.html',
  styleUrl: './funcionario-perfil.component.scss',
})
export class FuncionarioComponent implements OnInit {
  usuarioLogado: UsuarioPerfil | null = null;
  fotoUrl: string = '';
  areasDeAtuacao: string[] = [];
  cargo: 'Coordenador' | 'Professor' | null = null;

  router = inject(Router);
  coordenadorService = inject(CoordenadorService);
  professorService = inject(ProfessorService);
  userDataService = inject(UserdataService);
  tokenDecode = inject(TokenDecode);

  role = this.tokenDecode.getRole();

  ngOnInit(): void {
    this.buscarDadosDoUsuario();
  }

  private buscarEmailDoToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.email ?? payload.sub ?? null;
      } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return null;
      }
    }
    return null;
  }

  private buscarDadosDoUsuario(): void {
    const emailDoToken = this.buscarEmailDoToken();

    if (!emailDoToken) {
      console.error('Não foi possível obter o email para buscar o perfil.');
      return;
    }

    if (this.role == "COORDENADOR") {
      this.carregarDadosCoordenador(emailDoToken);
    } else if (this.role == "PROFESSOR"){
      this.buscarDadosProfessor(emailDoToken);
    }

  }

  carregarDadosCoordenador(emailDoToken: string) {
    this.coordenadorService.getCoordenadorPorEmail(emailDoToken).subscribe({
      next: (coordenador) => {
        if (coordenador && coordenador.id) {
          this.setPerfilData(coordenador, 'Coordenador');
        } else {
          this.buscarDadosProfessor(emailDoToken);
        }
      },
      error: (erro) => {
        console.warn('Falha ao buscar como Coordenador, tentando como Professor.', erro);
        this.buscarDadosProfessor(emailDoToken);
      },
    });
  }




  private buscarDadosProfessor(emailDoToken: string): void {
    this.professorService.getProfessorPorEmail(emailDoToken).subscribe({
      next: (professor) => {
        if (professor && professor.id) {
          this.setPerfilData(professor, 'Professor');
        } else {
          console.error('Usuário não encontrado como Coordenador ou Professor.');
        }
      },
      error: (erro) => {
        console.error('Erro ao buscar dados do Professor:', erro);
      },
    });
  }

  private setPerfilData(data: UsuarioPerfil, cargo: 'Coordenador' | 'Professor'): void {
    this.usuarioLogado = data;
    this.cargo = cargo;

    //console.log(`Dados do ${this.cargo} (estrutura da API):`, this.usuarioLogado);

    if (cargo === 'Coordenador') {
        this.userDataService.setCoordenador(data);
    } else {
        this.userDataService.setProfessor(data);
    }
    
    this.processarAreasDeAtuacao(this.usuarioLogado.cursos ?? []);
    this.carregarDadosLocal();
  }

  private processarAreasDeAtuacao(cursos: Curso[]): void {
    //console.log('Cursos recebidos para processamento:', cursos);
    if (cursos && cursos.length > 0) {
      const nomesDeAreas: string[] = cursos
        .map((curso) => curso.areaDeAtuacao?.nome)
        .filter((nome): nome is string => !!nome);

      const areasUnicas = new Set(nomesDeAreas);
      this.areasDeAtuacao = Array.from(areasUnicas);

      //console.log('Áreas de atuação do perfil (únicas):', this.areasDeAtuacao);
    } else {
      this.areasDeAtuacao = [];
    }
  }

  private carregarDadosLocal(): void {
    const dadosSalvos = localStorage.getItem(`perfil_${this.cargo}_${this.usuarioLogado?.id}`);
    if (dadosSalvos) {
      const perfil = JSON.parse(dadosSalvos);
      this.fotoUrl = perfil.fotoUrl || '';
    }
  }

  private salvarDados(): void {
    const perfil = {
      fotoUrl: this.fotoUrl,
    };
    if (this.usuarioLogado && this.cargo) {
        localStorage.setItem(`perfil_${this.cargo}_${this.usuarioLogado.id}`, JSON.stringify(perfil));
    }
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoUrl = reader.result as string;
        this.salvarDados();
      };
      reader.readAsDataURL(file);
    }
  }

  editarInformacoes() {
    if (!this.usuarioLogado || !this.usuarioLogado.id || !this.cargo) {
        Swal.fire('Erro', 'Dados do perfil incompletos para edição.', 'error');
        return;
    }
    const id = this.usuarioLogado.id.toString(); // <--- CONVERSÃO PARA STRING AQUI!
    
    if (this.cargo === 'Coordenador') {
      this.router.navigate(['/coordenacao/coordenacao-editar', id]);
    } else if (this.cargo === 'Professor') {
      this.router.navigate(['/cadastro-professor', id]);
    } else {
        console.error("Cargo não identificado. Não é possível editar.");
        Swal.fire('Erro', 'Cargo não identificado.', 'error');
    }
  }

  excluirConta() {
    if (!this.usuarioLogado || !this.usuarioLogado.id || !this.cargo) {
        Swal.fire('Erro', 'ID do usuário não encontrado.', 'error');
        return;
    }
    
    const service = this.cargo === 'Coordenador' ? this.coordenadorService : this.professorService;

    Swal.fire({
      title: 'Tem certeza que deseja excluir sua conta?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        
        service.delete(this.usuarioLogado!.id as number).subscribe({
          next: () => {
            Swal.fire(
              'Deletado!',
              'Sua conta foi removida com sucesso.',
              'success'
            );
            this.userDataService.clearCoordenador();
            this.userDataService.clearProfessor();
            this.router.navigate(['/login']);
          },
          error: (res: any) =>
            Swal.fire('Erro', res.error?.message || 'Não foi possível deletar a conta', 'error'),
        });
      }
    });
  }
}
