import { Component, inject } from '@angular/core';
import { Mentor } from '../../../../models/mentor/mentor';
import { Grupo } from '../../../../models/grupo/grupo';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Reuniao } from '../../../../models/reuniao/reuniao';
import { ReuniaoService } from '../../../../services/reuniao/reuniao.service';
import { ActivatedRoute } from '@angular/router';
import { Aluno } from '../../../../models/aluno/aluno';
import { GrupoService } from '../../../../services/grupo/grupo.service';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar-reuniao',
  imports: [FormsModule],
  templateUrl: './criar-reuniao.component.html',
  styleUrl: './criar-reuniao.component.scss',
})
export class CriarReuniaoComponent {
  isLoading = true;
  form!: FormGroup;

  mentores: Mentor[] = [];
  grupos: Grupo[] = [];
  grupo!: Grupo;
  aluno!: Aluno;

  grupoService = inject(GrupoService);
  alunoService = inject(AlunoService);

  reuniao!: Reuniao;

  idEdicao?: number;

  role = localStorage.getItem('role');

  fb = inject(FormBuilder);
  reuniaoService = inject(ReuniaoService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = this.fb.group({
      assunto: ['', Validators.required],
      data: ['', Validators.required],
      hora: ['', Validators.required],
      formatoReuniao: ['', Validators.required],
      statusReuniao: ['', Validators.required],
      mentor: ['', Validators.required],
      grupo: ['', Validators.required],
    });

    this.idEdicao = Number(this.route.snapshot.paramMap.get('id'));

    this.carregarDados();
  }

  carregarDados(): void {
    // Coloque suas chamadas reais
    setTimeout(() => {
      if (this.role == 'ALUNO') {
        this.carregaAluno();
      }

      // Se estiver editando
      /* if (this.idEdicao) {
        this.reuniaoService.buscarPorId(this.idEdicao).subscribe((r) => {
          this.form.patchValue(r);
        });
      }*/

      this.isLoading = false;
    }, 600);
  }

  carregaAluno() {
    this.alunoService.getMyProfile().subscribe({
      next: (aluno) => {
        this.aluno = aluno;
        if (aluno.id) {
          this.carregaGrupoAluno(aluno.id);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar aluno logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
      },
    });
  }

  carregaGrupoAluno(id: number) {
    this.grupoService.getGrupoByAlunoId(id).subscribe({
      next: grupo => {
        this.grupo = grupo;
      }
    })
  }

  salvar(): void {
    if (this.form.invalid) return;

    const reuniao: Reuniao = this.form.value;
    /*
    if (this.idEdicao) {
      this.reuniaoService.atualizar(this.idEdicao, reuniao).subscribe(() => {
        console.log('Reunião atualizada');
      });
    } else {
      this.reuniaoService.criar(reuniao).subscribe(() => {
        console.log('Reunião criada!');
      });
    }*/
  }

  salvarReuniao() {
    console.log('Reunião salva:', this.reuniao);
  }

  voltar() {
    history.back();
  }
}
