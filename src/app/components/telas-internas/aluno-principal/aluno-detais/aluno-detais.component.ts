import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';

@Component({
  selector: 'app-aluno-detais',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './aluno-detais.component.html',
  styleUrls: ['./aluno-detais.component.scss'],
})
export class AlunoDetaisComponent implements OnInit {
  aluno: Aluno = {} as Aluno;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alunoService: AlunoService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.carregarAluno(id);
    }
  }

  carregarAluno(id: number): void {
    this.alunoService.findById(id).subscribe({
      next: (dados) => {
        this.aluno = dados;
        this.aluno.senha = '';
      },
      error: (err) => {
        Swal.fire(
          'Erro!',
          'Não foi possível carregar os dados do aluno.',
          'error'
        );
        this.router.navigate(['/alunos/perfil']);
      },
    });
  }

  atualizar(): void {
    if (!this.aluno.id) {
      Swal.fire('Erro!', 'ID do aluno não encontrado.', 'error');
      return;
    }

    this.alunoService.update(this.aluno.id, this.aluno).subscribe({
      next: (alunoAtualizado) => {
        Swal.fire({
          title: 'Sucesso!',
          text: `Os dados de ${alunoAtualizado.nome} foram atualizados.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        this.router.navigate(['/alunos/perfil']);
      },
      error: (err) => {
        Swal.fire(
          'Erro na Atualização',
          'Não foi possível salvar as alterações.',
          'error'
        );
      },
    });
  }
}
