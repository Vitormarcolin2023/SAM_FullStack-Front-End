import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importe o CommonModule para usar @if no template
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs'; // 1. IMPORTE o 'firstValueFrom'

import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true, // 2. DEFINA O COMPONENTE COMO STANDALONE
  imports: [
    CommonModule, // Necessário para diretivas como @if
    RouterLink,
  ],
  templateUrl: './aluno-perfil.component.html',
  styleUrls: ['./aluno-perfil.component.scss'],
})
export class AlunoPerfilComponent implements OnInit {
  aluno: Aluno | null = null;

  constructor(private alunoService: AlunoService) {}

  ngOnInit(): void {
    this.abrirModalEmail();
  }


  async abrirModalEmail(): Promise<void> {
    const result = await Swal.fire({
      title: 'Identificação do Aluno',
      text: 'Para visualizar seus dados, por favor, digite seu e-mail de cadastro.',
      input: 'email',
      inputPlaceholder: 'seu.email@dominio.com',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Buscar Informações',
      showLoaderOnConfirm: true,


      preConfirm: async (email) => {
        if (!email) {
          Swal.showValidationMessage('O campo de e-mail é obrigatório');
          return; 
        }

        try {
          
          const alunoEncontrado = await firstValueFrom(
            this.alunoService.getAlunoPorEmail(email)
          );
          return alunoEncontrado; 
        } catch (error) {
          Swal.showValidationMessage(
            `Falha na busca: Aluno não encontrado ou API offline.`
          );
          return; 
        }
      },
    });

  
    if (result.isConfirmed && result.value) {
      this.aluno = result.value;

      Swal.fire({
        icon: 'success',
        title: 'Aluno Encontrado!',
        text: `Bem-vindo(a)!`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }
}
