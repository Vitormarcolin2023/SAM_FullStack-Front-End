import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mentor-perfil',
  standalone: true,
  imports: [CommonModule, NavbarTelasInternasComponent, SidebarComponent],
  templateUrl: './mentor-perfil.component.html',
  styleUrls: ['./mentor-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MentorPerfilComponent implements OnInit {

  fotoUrl: string = '';
  nome: string = '';
  area: string = '';
  resumo: string = '';
  minicurriculo: string = '';

  mentorId!: number; // vem da rota

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mentorId = Number(this.route.snapshot.paramMap.get('id')); // pega o id da URL
    this.carregarDadosBack();
    this.carregarDadosLocal();
  }

  /** Busca nome e área do mentor no back-end */
  private carregarDadosBack(): void {
    this.http.get<any>(`http://localhost:8080/mentores/${this.mentorId}`)
      .subscribe({
        next: (mentor) => {
          this.nome = mentor.nome;
          this.area = mentor.areaDeAtuacao?.nome || ''; // depende de como está o model no back
        },
        error: (err) => {
          console.error('Erro ao buscar mentor:', err);
        }
      });
  }

  /** Carrega resumo, minicurrículo e foto do localStorage */
  private carregarDadosLocal(): void {
    const dadosSalvos = localStorage.getItem(`perfilMentor_${this.mentorId}`);
    if (dadosSalvos) {
      const perfil = JSON.parse(dadosSalvos);
      this.fotoUrl = perfil.fotoUrl || '';
      this.resumo = perfil.resumo || '';
      this.minicurriculo = perfil.minicurriculo || '';
    }
  }

  private salvarDados(): void {
    const perfil = {
      fotoUrl: this.fotoUrl,
      resumo: this.resumo,
      minicurriculo: this.minicurriculo,
    };
    localStorage.setItem(`perfilMentor_${this.mentorId}`, JSON.stringify(perfil));
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

  editarInfos(): void {
    Swal.fire({
      title: 'Editar Informações',
      html: `
        <textarea id="swal-resumo" class="swal2-textarea"
          placeholder="Escreva aqui um breve resumo sobre o mentor">${this.resumo || ''}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const resumo = (document.getElementById('swal-resumo') as HTMLTextAreaElement).value.trim();
        return { resumo };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.resumo = result.value.resumo;
        this.salvarDados();
        Swal.fire('Salvo!', 'As informações foram atualizadas.', 'success');
      }
    });
  }

  editarMinicurriculo(): void {
    Swal.fire({
      title: 'Editar Minicurrículo',
      html: `
        <textarea id="swal-minicurriculo" class="swal2-textarea" placeholder="Escreva aqui o seu minicurrículo">${this.minicurriculo || ''}</textarea>
        <div id="char-count" style="text-align:right; font-size:0.8rem; color:#888; margin-top:4px;">${this.minicurriculo ? this.minicurriculo.length : 0}/100</div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const textarea = document.getElementById('swal-minicurriculo') as HTMLTextAreaElement;
        const value = textarea.value.trim();
        if (value.length < 100) {
          Swal.showValidationMessage(`O minicurrículo deve ter pelo menos 100 caracteres (${value.length}/100)`);
          return false;
        }
        return value;
      },
      didOpen: () => {
        const textarea = document.getElementById('swal-minicurriculo') as HTMLTextAreaElement;
        const charCount = document.getElementById('char-count') as HTMLDivElement;

        textarea.addEventListener('input', () => {
          charCount.textContent = `${textarea.value.length}/100`;
        });
      }
    }).then(result => {
      if (result.isConfirmed && result.value !== undefined) {
        this.minicurriculo = result.value;
        this.salvarDados();
        Swal.fire('Salvo!', 'O minicurrículo foi atualizado.', 'success');
      }
    });
  }
}
