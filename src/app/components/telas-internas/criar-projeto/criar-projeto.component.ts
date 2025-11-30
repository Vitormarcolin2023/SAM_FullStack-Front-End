import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormsModule,
} from '@angular/forms';
import { Projeto } from '../../../models/projeto/projeto';
import { MentorService } from '../../../services/mentores/mentores.service';
import { AreaDeAtuacaoService } from '../../../services/areaDeAtuacao/area-de-atuacao.service';
import { CommonModule } from '@angular/common';
import { Mentor } from '../../../models/mentor/mentor';
import { AreaDeAtuacao } from '../../../models/areadeatuacao/areadeatuacao';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import Swal from 'sweetalert2';
import { NavbarTelasInternasComponent } from '../../design/navbar-telas-internas/navbar-telas-internas.component';
import { SidebarComponent } from '../../design/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoService } from '../../../services/grupo/grupo.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AlunoService } from '../../../services/alunos/alunos.service';
import { ProfessorService } from '../../../services/professor/professor.service';
import { Professor } from '../../../models/professor/professor';

@Component({
  selector: 'app-criar-projeto',
  templateUrl: './criar-projeto.component.html',
  styleUrls: ['./criar-projeto.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SidebarComponent],
})
export class CriarProjetoComponent implements OnInit {
  formProjeto!: FormGroup;
  modoEdicao = false;
  carregando = false;
  modalAberto = false;
  idProjeto: number | null = null;

  mentores: Mentor[] = [];
  areasDeAtuacao: AreaDeAtuacao[] = [];
  grupos: any[] = [];
  professores: Professor[] = [];
  professoresFiltrados: Professor[] = [];
  professoresSelecionados: Professor[] = [];
  mentoresFiltradosModal: Mentor[] = [];
  areaSelecionadaNoModal: AreaDeAtuacao | null = null;
  listaOriginalMentoresModal: Mentor[] = [];

  filtroNome: string = '';
  filtroArea: string = '';

  semGrupo = false;

  periodosDisponiveis: string[] = [
    '1º Período',
    '2º Período',
    '3º Período',
    '4º Período',
    '5º Período',
    '6º Período',
    '7º Período',
    '8º Período',
    '9º Período',
    '10º Período',
  ];

  constructor(
    private fb: FormBuilder,
    private mentorService: MentorService,
    private areaService: AreaDeAtuacaoService,
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private grupoService: GrupoService,
    private alunoService: AlunoService,
    private professorService: ProfessorService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarGrupos();
    this.carregarDadosIniciais();
    this.monitorarAreaDeAtuacao();
    this.monitorarDataInicio();
    this.carregarProfessores();

    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.modoEdicao = true;
        this.idProjeto = +id;
        this.carregarProjeto(this.idProjeto);
      }
    });
  }

  private monitorarDataInicio(): void {
    this.formProjeto
      .get('dataInicioProjeto')
      ?.valueChanges.subscribe((inicio) => {
        // 1. Se não tiver valor ou se a string for muito curta (ex: usuário ainda digitando), para tudo.
        if (!inicio || inicio.length < 10) {
          this.formProjeto.get('dataFinalProjeto')?.setValue('');
          return;
        }

        const dataInicio = new Date(inicio);

        // 2. Verifica se é uma data válida (evita o erro do ano 20226)
        if (isNaN(dataInicio.getTime())) {
          return;
        }

        const dataFinalAutomatico = new Date(dataInicio);
        // Adiciona 6 meses
        dataFinalAutomatico.setMonth(dataFinalAutomatico.getMonth() + 6);

        // Formata para YYYY-MM-DD
        const dataFinalFormatada = dataFinalAutomatico
          .toISOString()
          .split('T')[0];

        this.formProjeto
          .get('dataFinalProjeto')
          ?.setValue(dataFinalFormatada, { emitEvent: false });
      });
  }

  initForm() {
    this.formProjeto = this.fb.group(
      {
        nomeDoProjeto: ['', Validators.required],
        descricao: ['', Validators.required],
        periodo: ['', Validators.required],
        dataInicioProjeto: ['', Validators.required],
        dataFinalProjeto: ['', Validators.required],
        areaDeAtuacao: [null, Validators.required],
        mentor: [{ value: null, disabled: true }, Validators.required],
        grupo: [null, Validators.required],
        professores: [[], Validators.required],
      },
      {
        validators: [this.validarDatasProjeto()],
      }
    );
  }

  carregarDadosIniciais() {
    this.areaService.findAll().subscribe((data) => {
      this.areasDeAtuacao = data;
      if (!this.modoEdicao && this.alunoService.getAlunoLogadoId()) {
        this.preencherAreaDeAtuacaoDoAluno();
      }
    });
  }

  preencherAreaDeAtuacaoDoAluno(): void {
    this.areaService.findAreaDeAtuacaoByAlunoLogado().subscribe({
      next: (areaDoAluno) => {
        if (areaDoAluno) {
          const areaCorrespondente = this.areasDeAtuacao.find(
            (a) => a.id === areaDoAluno.id
          );
          if (areaCorrespondente) {
            this.formProjeto.patchValue({ areaDeAtuacao: areaCorrespondente });
          }
        }
      },
      error: (err) => {
        console.error(
          'Nenhuma área de atuação encontrada para o aluno logado.',
          err
        );
      },
    });
  }

  monitorarAreaDeAtuacao(): void {
    this.formProjeto
      .get('areaDeAtuacao')
      ?.valueChanges.subscribe((areaSelecionada) => {
        const mentorControl = this.formProjeto.get('mentor');

        this.mentores = [];
        mentorControl?.reset();

        if (areaSelecionada && areaSelecionada.id) {
          mentorControl?.enable();
          this.mentorService
            .findByAreaDeAtuacao(areaSelecionada.id)
            .subscribe((data) => {
              this.mentores = data;
            });
        } else {
          mentorControl?.disable();
        }
      });
  }

  carregarGrupos(): void {
    this.grupoService.getGrupos().subscribe({
      next: (res) => {
        this.grupos = res;
        if (!this.modoEdicao && this.alunoService.getAlunoLogadoId()) {
          this.preencherGrupoDoAluno();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar grupos:', err);
      },
    });
  }

  preencherGrupoDoAluno(): void {
    this.grupoService.findGrupoByAlunoLogado().subscribe({
      next: (grupoDoAluno) => {
        if (grupoDoAluno) {
          const grupoCorrespondente = this.grupos.find(
            (g) => g.id === grupoDoAluno.id
          );
          if (grupoCorrespondente) {
            this.formProjeto.patchValue({ grupo: grupoCorrespondente });
            this.semGrupo = false;

            this.verificarProjetoDoGrupo(grupoCorrespondente.id);

            this.formProjeto.enable();
          }
        } else {
          this.semGrupo = true;
          this.formProjeto.disable();

          setTimeout(() => {
            this.exibirAlertaSemGrupo();
          }, 0);
        }
      },
      error: (err) => {
        console.error('Nenhum grupo encontrado para o aluno logado.', err);
        this.semGrupo = true;
        this.formProjeto.disable();

        setTimeout(() => {
          this.exibirAlertaSemGrupo();
        }, 0);
      },
    });
  }

  verificarProjetoDoGrupo(idGrupo: number): void {
    // 1. REGRA DE OURO: Se estamos no Modo Edição, ignoramos a verificação.
    // É óbvio que o projeto existe se estamos editando ele.
    if (this.modoEdicao) {
      return;
    }

    this.projetoService.findByGrupo(idGrupo).subscribe({
      next: (projeto) => {
        // 2. Log para você ver no console o que diabos o backend está retornando
        console.log('Verificando projeto do grupo:', projeto);

        // 3. Verificação Robusta:
        // Só bloqueia se 'projeto' existir E tiver um ID válido.
        // Isso evita que objetos vazios {} ou null travem a tela.
        if (projeto && projeto.id) {
          Swal.fire({
            icon: 'warning',
            title: 'Este grupo já possui um projeto!',
            text: `Já existe o projeto "${
              projeto.nomeDoProjeto || 'Desconhecido'
            }" cadastrado.`,
          });
          this.formProjeto.disable();
        }
      },
      error: (err) => {
        console.log('Erro ao verificar projeto:', err);

        // 4. Se der 404 (Not Found), ISSO É BOM!
        // Significa que não tem projeto, então o usuário pode criar.
        if (err.status === 404) {
          return; // Segue o jogo, libera o cadastro.
        }

        // Removi o bloqueio do erro 400.
        // Às vezes o backend joga erro 400 só por validação, não deve bloquear a tela inteira.
      },
    });
  }

  exibirAlertaSemGrupo(): void {
    Swal.fire({
      title: 'Você não está em um grupo',
      text: 'Para criar um projeto, é necessário estar em um grupo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Criar grupo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/grupo/criar-grupo']);
      }
    });
  }

  carregarProfessores(): void {
    this.professorService.findAll().subscribe({
      next: (res) => {
        this.professores = res;
        this.professoresFiltrados = res;
      },
      error: (err) => {
        console.error('Erro ao carregar professores:', err);
      },
    });
  }

  pesquisarProfessores(event: Event): void {
    const termo = (event.target as HTMLInputElement).value.toLowerCase();
    this.professoresFiltrados = this.professores.filter((p) =>
      p.nome.toLowerCase().includes(termo)
    );
  }

  toggleProfessorSelecao(professor: Professor): void {
    const index = this.professoresSelecionados.findIndex(
      (p) => p.id === professor.id
    );

    if (index >= 0) {
      this.professoresSelecionados.splice(index, 1);
    } else {
      this.professoresSelecionados.push(professor);
    }
    this.formProjeto.get('professores')?.setValue(this.professoresSelecionados);
  }

  isProfessorSelecionado(professor: Professor): boolean {
    return this.professoresSelecionados.some((p) => p.id === professor.id);
  }

  carregarProjeto(id: number) {
    this.projetoService.findById(id).subscribe((projeto) => {
      if (projeto.areaDeAtuacao && projeto.areaDeAtuacao.id) {
        this.mentorService
          .findByAreaDeAtuacao(projeto.areaDeAtuacao.id)
          .subscribe((mentoresDaArea: Mentor[]) => {
            this.mentores = mentoresDaArea;

            this.formProjeto.patchValue({
              nomeDoProjeto: projeto.nomeDoProjeto,
              descricao: projeto.descricao,
              periodo: projeto.periodo,
              dataInicioProjeto: projeto.dataInicioProjeto,
              dataFinalProjeto: projeto.dataFinalProjeto,
              areaDeAtuacao: this.areasDeAtuacao.find(
                (a) => a.id === projeto.areaDeAtuacao?.id
              ),
              mentor: this.mentores.find((m) => m.id === projeto.mentor?.id),
              grupo: this.grupos.find((g) => g.id === projeto.grupo?.id),
              professores: projeto.professores,
            });

            this.formProjeto.get('mentor')?.enable();
          });
      }
    });
  }

  validarDatasProjeto(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const inicio = group.get('dataInicioProjeto')?.value;
      const fim = group.get('dataFinalProjeto')?.value;
      if (!inicio || !fim) return null;
      return new Date(inicio) > new Date(fim) ? { dataInvalida: true } : null;
    };
  }

  onAreaDeAtuacaoChange(): void {
    const areaSelecionada = this.formProjeto.get('areaDeAtuacao')?.value;

    if (!areaSelecionada) {
      this.mentores = [];
      this.formProjeto.get('mentor')?.reset();
      this.formProjeto.get('mentor')?.disable();
      return;
    }
    this.mentorService.findByAreaDeAtuacao(areaSelecionada.id).subscribe({
      next: (mentores) => {
        this.mentores = mentores;
        this.formProjeto.get('mentor')?.enable();
      },
      error: (err) => {
        console.error('Erro ao buscar mentores:', err);
      },
    });
  }

  trackByProfessorId(index: number, professor: Professor): number {
    return professor.id ?? index;
  }

  abrirModalMentor(): void {
    this.modalAberto = true;
    this.areaSelecionadaNoModal =
      this.formProjeto.get('areaDeAtuacao')?.value || null;
    this.trocarAreaNoModal();
  }

  fecharModalMentor(): void {
    this.modalAberto = false;
  }

  trocarAreaNoModal(): void {
    if (!this.areaSelecionadaNoModal || !this.areaSelecionadaNoModal.id) {
      this.mentoresFiltradosModal = [];
      return;
    }

    this.mentorService
      .findByAreaDeAtuacao(this.areaSelecionadaNoModal.id)
      .subscribe((mentores) => {
        this.listaOriginalMentoresModal = mentores.filter(
          (m) => m.statusMentor === 'ATIVO'
        );
        this.filtrarMentoresModal();
      });
  }
  filtrarMentoresModal(event?: Event): void {
    if (event) {
      this.filtroNome = (event.target as HTMLInputElement).value
        .toLowerCase()
        .trim();
    }
    this.mentoresFiltradosModal = this.listaOriginalMentoresModal.filter((m) =>
      m.nome.toLowerCase().includes(this.filtroNome ?? '')
    );
  }

  selecionarMentor(mentor: Mentor): void {
    this.formProjeto.get('mentor')?.setValue(mentor);
    this.modalAberto = false;
  }

  onSubmit() {
    if (this.formProjeto.disabled) {
      Swal.fire({
        icon: 'warning',
        title: 'Ação bloqueada',
        text: 'Seu grupo já possui um projeto cadastrado.',
      });
      return;
    }

    if (this.semGrupo) {
      Swal.fire({
        icon: 'warning',
        title: 'Não é possivel criar projeto',
        text: 'Você precisa estar em um grupo para criarum projeto.',
      });
      return;
    }

    if (!this.formProjeto.valid) {
      this.formProjeto.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Por favor, preencha todos os campos obrigatórios corretamente.',
      });
      return;
    }
    const projeto: Projeto = this.formProjeto.value;

    this.carregando = true;

    const acao =
      this.modoEdicao && this.idProjeto
        ? this.projetoService.update(this.idProjeto, projeto)
        : this.projetoService.save(projeto);

    acao.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicao
            ? 'Projeto Atualizado!'
            : 'Projeto Cadastrado!',
          text: this.modoEdicao
            ? 'As informações do projeto foram salvas.'
            : 'O projeto foi salvo com sucesso!',
        });
        this.modoEdicao
          ? this.router.navigate(['/visual-projeto'])
          : this.formProjeto.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: this.modoEdicao ? 'Erro ao Atualizar' : 'Erro ao Salvar',
          text: err.error?.message || 'Erro desconhecido.',
        });
      },
    });
  }

  hasError(campo: string, erro: string): boolean {
    const controle = this.formProjeto.get(campo);
    if (!controle) return false;
    return controle.hasError(erro) && controle.touched;
  }

  voltar() {
    this.router.navigate(['/visual-projeto']);
  }
}
