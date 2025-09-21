import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { Mentor } from '../../../models/mentor/mentor';
import { ViaCepService } from '../../../services/viaCep/via-cep.service';
import { AreaDeAtuacaoService } from '../../../services/areaDeAtuacao/area-de-atuacao.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { MentorService } from '../../../services/mentores/mentores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-edit',
  standalone: true,
  imports: [CommonModule, MdbFormsModule, FormsModule, NavbarTelasInternasComponent, SidebarComponent],
  templateUrl: './mentor-edit.component.html',
  styleUrls: ['./mentor-edit.component.scss'],
})
export class MentorEditComponent {
  

  modalRef: any;
  areasDeAtuacao: Mentor['areaDeAtuacao'][] = [];
  isLoadingCep = false;
  isRuaBairroReadonly = true;
  mentorService = inject(MentorService);
  mentor!: Mentor;
  router = inject(Router);

  private areaDeAtuacaoService = inject(AreaDeAtuacaoService);
  private viaCepService = inject(ViaCepService);

  ngOnInit() {
    this.loadAreasDeAtuacao();
    this.mentorService.getMyProfile().subscribe({
    next: (mentor) => {
      this.mentor = mentor;
      this.loadAreasDeAtuacao();
    },
    error: (erro) => {
      Swal.fire({
        title: 'Erro',
        text: 'Não foi possível carregar os dados do mentor.',
        icon: 'error',
        customClass: { container: 'swal-container-on-top' },
      });
      // opcional: redirecionar para home/login
      this.router.navigate(['/login']);
    },
  });
  }


  loadAreasDeAtuacao(): void {
    this.areaDeAtuacaoService.findAll().subscribe({
      next: (data) => {
        this.areasDeAtuacao = data.map((a) => ({
          id: a.id,
          nome: a.nome,
        }));

        // Corrigido: fechar o if e o find corretamente
        const areaSelecionada = this.areasDeAtuacao.find(
          (a) => a.id === this.mentor.areaDeAtuacao.id
        );

        if (areaSelecionada) {
          this.mentor.areaDeAtuacao = areaSelecionada;
        }
        // se não encontrar, mantém o valor atual do mentor
      },
      error: () => {
        Swal.fire({
          title: 'Falha na Conexão',
          text: 'Não foi possível carregar as áreas de atuação.',
          icon: 'error',
          customClass: { container: 'swal-container-on-top' },
        });
      },
    });
  }

  buscarCep(): void {
    const cep = this.mentor.endereco?.cep;
    if (cep && cep.replace(/\D/g, '').length === 8) {
      this.isLoadingCep = true;
      this.viaCepService.buscar(cep).subscribe({
        next: (data: any) => {
          this.isLoadingCep = false;
          if (!data.erro) {
            this.mentor.endereco = {
              ...this.mentor.endereco,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf,
            };
            this.isRuaBairroReadonly = !(
              data.logradouro === '' || data.bairro === ''
            );
          } else {
            Swal.fire({
              title: 'CEP não encontrado',
              text: 'Por favor, verifique o CEP digitado.',
              icon: 'error',
              customClass: { container: 'swal-container-on-top' },
            });
          }
        },
        error: () => {
          this.isLoadingCep = false;
          Swal.fire({
            title: 'Erro',
            text: 'Não foi possível consultar o CEP.',
            icon: 'error',
            customClass: { container: 'swal-container-on-top' },
          });
        },
      });
    }
  }

  salvar() {
  this.mentorService.update(this.mentor).subscribe({
    next: (mentorAtualizado) => {
      this.mentor = mentorAtualizado;
      Swal.fire({
        title: 'Salvo!',
        text: 'As informações foram atualizadas.',
        icon: 'success',
        customClass: { container: 'swal-container-on-top' },
      });
      this.router.navigate(["/mentor-perfil"]);
    },
    error: (erro: any) => {
      Swal.fire({
        title: 'Erro',
        text: erro?.error?.message || 'Erro ao atualizar',
        icon: 'error',
        customClass: { container: 'swal-container-on-top' },
      });
    },
  });
}

}
