import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs'; 

import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';

@Component({
  selector: 'app-aluno-perfil',
  standalone: true, 
  imports: [CommonModule,RouterLink,],
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
      confirmButtonColor: 'rgb(28, 232, 151)',
      showLoaderOnConfirm: true,
      
      // Adicionando o botão de cancelamento
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
       cancelButtonColor: '#a3a3a3ff',
      reverseButtons: true,

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
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Ação quando o botão "Cancelar" é clicado
        // Aqui você pode adicionar a lógica de redirecionamento ou qualquer outra ação
        console.log('Busca de e-mail cancelada pelo usuário.');
        // Por exemplo, você pode redirecionar para uma outra página se necessário
        // this.router.navigate(['/outra-pagina']);
    }
  }
}