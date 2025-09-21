import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aluno-detais',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './aluno-detais.component.html',
  styleUrls: ['./aluno-detais.component.scss'],
})
export class AlunoDetaisComponent implements OnInit {
  aluno: Aluno = {} as Aluno;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alunoService = inject(AlunoService);

  ngOnInit(): void {
    const emailParam = this.route.snapshot.paramMap.get('email');
    if (emailParam) {
      this.carregarAluno(emailParam);
    } else {
      Swal.fire('Erro!', 'E-mail do aluno não fornecido na URL.', 'error');
      this.router.navigate(['/']);
    }
  }

  carregarAluno(email: string): void {
    this.alunoService.getAlunoPorEmail(email).subscribe({
      next: (dados) => {
        this.aluno = dados;

        this.aluno.senha = '';
      },
      error: () =>
        Swal.fire(
          'Erro!',
          'Não foi possível carregar os dados do aluno.',
          'error'
        ),
    });
  }

  atualizar(): void {
    if (!this.aluno.id) {
      Swal.fire(
        'Erro!',
        'ID do aluno não encontrado para realizar a atualização.',
        'error'
      );
      return;
    }

    const payloadParaEnviar = {
      ...this.aluno,
      senha:
        this.aluno.senha && this.aluno.senha.trim() !== ''
          ? this.aluno.senha
          : null,
    };

    this.alunoService.update(this.aluno.id, payloadParaEnviar).subscribe({
      next: (alunoAtualizado) => {
        Swal.fire({
          title: 'Sucesso!',
          text: `Os dados foram atualizados.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this.router.navigate(['/alunos/perfil']);
      },
      error: (err) => {
        const mensagemErro =
          err.error?.message || 'Não foi possível salvar as alterações.';
        console.error(
          'Erro na atualização. Payload enviado:',
          payloadParaEnviar
        );
        console.error('Resposta do servidor:', err);
        Swal.fire('Erro na Atualização', mensagemErro, 'error');
      },
    });
  }
}
