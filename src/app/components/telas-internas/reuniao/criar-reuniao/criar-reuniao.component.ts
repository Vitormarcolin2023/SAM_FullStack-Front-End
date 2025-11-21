import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReuniaoDto } from '../../../../models/reuniao/reuniao';
import { ReuniaoService } from '../../../../services/reuniao/reuniao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Aluno } from '../../../../models/aluno/aluno';
import { AlunoService } from '../../../../services/alunos/alunos.service';
import Swal from 'sweetalert2';
import { Projeto } from '../../../../models/projeto/projeto';
import { ProjetoService } from '../../../../services/projeto/projeto.service';
import { TokenDecode } from '../../../../models/token/token-decode';
import { MentorService } from '../../../../services/mentores/mentores.service';
import { SidebarComponent } from '../../../design/sidebar/sidebar.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-criar-reuniao',
  imports: [FormsModule, CommonModule, SidebarComponent],
  templateUrl: './criar-reuniao.component.html',
  styleUrls: ['./criar-reuniao.component.scss'],
})
export class CriarReuniaoComponent {
  isLoading = true;
  form!: FormGroup;

  aluno: Aluno | null = null;
  mentor: any = null;
  projetoAluno: Projeto | null = null;
  projetosMentor: Projeto[] = [];

  reuniaoDto: ReuniaoDto = {
    assunto: '',
    data: '', 
    hora: '', 
    formatoReuniao: null!, 
    projeto_id: 0, 
    solicitadoPor: '',
  };

  idEdicao?: number;
  role: any;

  projetoService = inject(ProjetoService);
  alunoService = inject(AlunoService);
  mentorService = inject(MentorService);
  tokenDecode = inject(TokenDecode);

  fb = inject(FormBuilder);
  reuniaoService = inject(ReuniaoService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.role = this.tokenDecode.getRole();

    this.form = this.fb.group({
      assunto: ['', Validators.required],
      data: ['', Validators.required],
      hora: ['', Validators.required],
      formatoReuniao: ['', Validators.required],
      projeto: [null, Validators.required],
    });

    this.idEdicao = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarDados();
  }

  carregarDados(): void {
    if (this.role === 'ALUNO') {
      this.carregaAluno();
    } else if (this.role === 'MENTOR') {
      this.carregarMentor();
    } else {
      this.isLoading = false;
    }
  }

  carregarMentor() {
    this.mentorService.getMyProfile().subscribe({
      next: (mentor) => {
        this.mentor = mentor;
        if (mentor.id) {
          this.carregarProjetosAtivosMentor(mentor.id);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar mentor logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        this.isLoading = false;
      },
    });
  }

  carregarProjetosAtivosMentor(mentorId: number) {
    this.projetoService.buscarProjetosAtivos(mentorId).subscribe({
      next: (projetos) => {
        this.projetosMentor = projetos;
        this.isLoading = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Mentor não mentora nenhum projeto ativo.',
          text: 'Assim que tiver projetos, poderá agendar reuniões com os alunos.',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        this.isLoading = false;
      },
    });
  }

  carregaAluno() {
    this.alunoService.getMyProfile().subscribe({
      next: (aluno) => {
        this.aluno = aluno;
        if (aluno.id) {
          this.carregaProjetoAtivoAluno(aluno.id);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao encontrar aluno logado',
          text: 'Por favor, tente novamente mais tarde',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        this.isLoading = false;
      },
    });
  }

  carregaProjetoAtivoAluno(id: number) {
    this.projetoService.buscarProjetoAtivo(id).subscribe({
      next: (response) => {
        this.projetoAluno = response;
        if (response.id) {
          this.reuniaoDto.projeto_id = response.id; // já popula para o aluno
        }
        this.isLoading = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Aluno não possui projeto ativo.',
          text: 'Assim que tiver um projeto ativo, poderá agendar reuniões com seu mentor.',
          confirmButtonColor: 'rgb(255, 0, 0)',
        });
        this.isLoading = false;
      },
    });
  }

  salvarReuniao() {
  if (
    !this.reuniaoDto.assunto ||
    !this.reuniaoDto.data ||
    !this.reuniaoDto.hora ||
    !this.reuniaoDto.formatoReuniao ||
    (this.role === 'MENTOR' && !this.reuniaoDto.projeto_id)
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Preencha todos os campos',
      confirmButtonColor: 'rgb(255,0,0)',
    });
    return;
  }


  const dataSelecionada = new Date(this.reuniaoDto.data);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); 
  if (dataSelecionada < hoje) {
    Swal.fire({
      icon: 'error',
      title: 'Data inválida',
      text: 'A data da reunião não pode ser anterior à data atual.',
      confirmButtonColor: 'rgb(255,0,0)',
    });
    return;
  }

  const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
  if (!horaRegex.test(this.reuniaoDto.hora)) {
    Swal.fire({
      icon: 'error',
      title: 'Hora inválida',
      text: 'Insira uma hora válida no formato HH:mm ou HH:mm:ss.',
      confirmButtonColor: 'rgb(255,0,0)',
    });
    return;
  }

  this.reuniaoDto.hora = this.parseHora(this.reuniaoDto.hora);
  this.reuniaoDto.solicitadoPor = this.tokenDecode.getRole();

  this.reuniaoService.salvarReuniao(this.reuniaoDto).subscribe({
    next: (res: string) => {
      Swal.fire({
        icon: 'success',
        title: res, 
        confirmButtonColor: 'rgb(0,128,0)',
      }).then (() => {
        this.router.navigate(['/visual-projeto']);
      });
    }, 
    error: (err: HttpErrorResponse) => {
      console.error('Erro ao salvar:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar a reunião',
        text: err.error || err.message,
        confirmButtonColor: 'rgb(255,0,0)',
      });
    },
  });
}


  parseHora(horaStr: string): string {
    return horaStr?.length === 5 ? `${horaStr}:00` : horaStr;
  }

  voltar() {
    history.back();
  }
}
