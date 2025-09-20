import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aluno-perfil',
  templateUrl: './aluno-perfil.component.html',
  styleUrls: ['./aluno-perfil.component.scss'],
  imports: [RouterLink],
})
export class AlunoPerfilComponent implements OnInit {
  aluno: Aluno | null = null;

  constructor(private alunoService: AlunoService) {}

  ngOnInit(): void {
    this.abrirModalEmail();
  }

  abrirModalEmail(): void {
    Swal.fire({
      title: 'Identificação do Aluno',
      text: 'Para visualizar seus dados, por favor, digite seu e-mail de cadastro.',
      input: 'email',
      inputPlaceholder: 'seu.email@dominio.com',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Buscar Informações',
      showLoaderOnConfirm: true,

      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('O campo de e-mail é obrigatório');
          return false;
        }
        return this.alunoService
          .getAlunoPorEmail(email)
          .toPromise()
          .catch((error) => {
            Swal.showValidationMessage(
              `Falha na busca: Aluno não encontrado ou API offline.`
            );
            return false;
          });
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const alunoEncontrado: Aluno = result.value;
        this.aluno = alunoEncontrado;

        Swal.fire({
          icon: 'success',
          title: 'Aluno Encontrado!',
          text: `Bem-vindo(a), ${alunoEncontrado.nome}!`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }
}
