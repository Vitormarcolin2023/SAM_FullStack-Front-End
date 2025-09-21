import { Component, inject, OnInit } from '@angular/core';
import { Coordenador } from '../../../../models/coordenacao/coordenador';
import { Router } from '@angular/router';
import { CoordenadorService } from '../../../../services/coordenador.service';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import { NavbarTelasInternasComponent } from '../../../design/navbar-telas-internas/navbar-telas-internas.component';
import { Curso } from '../../../../models/curso/curso';
import { UserdataService } from '../../../../services/userdata.service';

@Component({
  selector: 'app-coordenacao-perfil',
  imports: [SidebarComponent, NavbarTelasInternasComponent],
  templateUrl: './coordenacao-perfil.component.html',
  styleUrl: './coordenacao-perfil.component.scss',
})
export class CoordenacaoPerfilComponent implements OnInit {
  coordenador!: Coordenador;
  fotoUrl: string = '';
  areasCoordenador: string[] = [];

  router = inject(Router);
  coordenadorService = inject(CoordenadorService);
  userDataService = inject(UserdataService);

  ngOnInit(): void {
    this.buscarDadosCoordenador();
  }

  private buscarDadosCoordenador(): void {
    const token = localStorage.getItem('token');
    let emailDoToken = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        emailDoToken = payload.email ?? payload.sub ?? '';
        console.log('Email extraído do token:', emailDoToken);
      } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return;
      }
    }

    if (emailDoToken) {
      this.coordenadorService.getCoordenadorPorEmail(emailDoToken).subscribe({
        next: (coordenador) => {
          this.coordenador = coordenador;
          console.log('Dados do coordenador:', this.coordenador);

          if (coordenador.cursos && coordenador.cursos.length > 0) {
            const nomesDeAreas: string[] = coordenador.cursos.map(
              (curso: Curso) => curso.areaDeAtuacao.nome
            );

            const areasUnicas = new Set(nomesDeAreas);
            this.areasCoordenador = Array.from(areasUnicas);

            console.log(
              'Áreas de atuação do coordenador (únicas):',
              this.areasCoordenador
            );
          }

          this.userDataService.setCoordenador(coordenador);
        },
        error: (erro) => {
          console.error('Erro ao buscar dados do coordenador:', erro);
        },
      });
    } else {
      console.error(
        'Não foi possível obter o email para buscar o coordenador.'
      );
    }
  }

  private carregarDadosLocal(): void {
    const dadosSalvos = localStorage.getItem(
      `perfilCoordenador_${this.coordenador}`
    );
    if (dadosSalvos) {
      const perfil = JSON.parse(dadosSalvos);
      this.fotoUrl = perfil.fotoUrl || '';
    }
  }

  private salvarDados(): void {
    const perfil = {
      fotoUrl: this.fotoUrl,
    };
    localStorage.setItem(
      `perfilCoordenador_${this.coordenador}`,
      JSON.stringify(perfil)
    );
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
    this.router.navigate(['/cadastro-coordenacao']);
  }

  excluirConta() {
    //implementar
  }
}
