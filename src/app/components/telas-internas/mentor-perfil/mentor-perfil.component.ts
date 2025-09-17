import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mentor-perfil',
  standalone: true,
  imports: [CommonModule, NavbarTelasInternasComponent, SidebarComponent],
  templateUrl: './mentor-perfil.component.html',
  styleUrls: ['./mentor-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MentorPerfilComponent implements OnInit { // Adicionando 'implements OnInit'
  fotoUrl: string = '';
  nome: string = '';
  area: string = '';
  resumo: string = '';
  minicurriculo: string = '';

  // 1. Método executado ao iniciar o componente
  ngOnInit(): void {
    this.carregarDadosDoLocalStorage();
  }

  // 2. Método para carregar os dados do LocalStorage
  carregarDadosDoLocalStorage(): void {
    const storedData = localStorage.getItem('mentorData');
    if (storedData) {
      const mentorData = JSON.parse(storedData);
      this.fotoUrl = mentorData.fotoUrl || '';
      this.nome = mentorData.nome || '';
      this.area = mentorData.area || '';
      this.resumo = mentorData.resumo || '';
      this.minicurriculo = mentorData.minicurriculo || '';
    }
  }

  // 3. Método para salvar todos os dados no LocalStorage
  salvarDadosNoLocalStorage(): void {
    const mentorData = {
      fotoUrl: this.fotoUrl,
      nome: this.nome,
      area: this.area,
      resumo: this.resumo,
      minicurriculo: this.minicurriculo
    };
    localStorage.setItem('mentorData', JSON.stringify(mentorData));
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fotoUrl = URL.createObjectURL(file);
      this.salvarDadosNoLocalStorage(); // Salvando a foto
    }
  }

  editarInfos(): void {
    Swal.fire({
      title: 'Editar Informações',
      html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome do Mentor" value="${this.nome || ''}">
        <input id="swal-area" class="swal2-input" placeholder="Área de Atuação" value="${this.area || ''}">
        <textarea id="swal-resumo" class="swal2-textarea"
          placeholder="Escreva aqui um breve resumo sobre o mentor">${this.resumo || ''}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      customClass: { container: 'swal2-container-modal' },
      preConfirm: () => {
        const nome = (document.getElementById('swal-nome') as HTMLInputElement).value.trim();
        const area = (document.getElementById('swal-area') as HTMLInputElement).value.trim();
        const resumo = (document.getElementById('swal-resumo') as HTMLTextAreaElement).value.trim();

        if (!nome || !area) {
          Swal.showValidationMessage('Nome e área são obrigatórios');
          return false;
        }

        return { nome, area, resumo };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.nome = result.value.nome;
        this.area = result.value.area;
        this.resumo = result.value.resumo;
        this.salvarDadosNoLocalStorage(); // Salvando as informações atualizadas
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
      customClass: { container: 'swal2-container-modal' },
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
        this.salvarDadosNoLocalStorage(); // Salvando o minicurrículo atualizado
        Swal.fire('Salvo!', 'O minicurrículo foi atualizado.', 'success');
      }
    });
  }
}