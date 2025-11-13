import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoordenadorService } from '../../../../services/coordenacao/coordenador.service';
import { CursosService } from '../../../../services/cursos.service';
import { UserdataService } from '../../../../services/coordenacao/userdata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from '../../../../models/curso/curso';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coordenacao-detais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coordenacao-detais.component.html',
  styleUrl: './coordenacao-detais.component.scss',
})
export class CoordenacaoDetaisComponent {
  CoordenacaoDetaisForm!: FormGroup;
  coordenadorService = inject(CoordenadorService);
  cursoService = inject(CursosService);
  userDataService = inject(UserdataService);
  route = inject(ActivatedRoute);

  cursosDisponiveis: Curso[] = [];
  coordenadorIdentifier: string | null = null;
  isEdicao: boolean = false;
  private routeSubscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loadCursosDisponiveis();
    this.checkRouteParams();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private setupForm(isEdicao: boolean): void {
    const senhaValidators = [Validators.minLength(6)];
    if (!isEdicao) {
      senhaValidators.push(Validators.required);
    }

    this.CoordenacaoDetaisForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: [
        { value: '', disabled: isEdicao },
        [Validators.required, Validators.email],
      ],
      senha: ['', senhaValidators],
      cursosIds: this.formBuilder.array([], Validators.required),
    });
  }

  private checkRouteParams(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const email = params.get('email');
      const id = params.get('id');

      const identifier = email || id;

      if (identifier) {
        this.coordenadorIdentifier = identifier;
        this.isEdicao = true;
        console.log(
          `Modo: Edição de Coordenador com identificador ${this.coordenadorIdentifier} ativo.`
        );

        this.setupForm(true);
        this.loadCoordenador(this.coordenadorIdentifier);
      } else {
        this.isEdicao = false;
        this.coordenadorIdentifier = null;
        this.setupForm(false);
        console.log('Modo: Cadastro de novo Coordenador ativo.');
      }
    });
  }

  private loadCoordenador(identifier: string): void {
    let loadObservable: Observable<any>;

    if (isNaN(Number(identifier))) {
      loadObservable =
        this.coordenadorService.getCoordenadorPorEmail(identifier);
    } else {
      loadObservable = this.coordenadorService.getCoordenadorPorId(
        Number(identifier)
      );
    }

    loadObservable.subscribe({
      next: (coordenador: any) => {
        if (coordenador) {
          if (coordenador.id) {
            this.coordenadorIdentifier = coordenador.id.toString();
          }
          this.carregarDadosParaEdicao(coordenador);
        } else {
          console.error(
            `Coordenador com identificador ${identifier} não encontrado.`
          );
          Swal.fire('Erro', 'Coordenador não encontrado para edição.', 'error');
          this.router.navigate(['/cadastro-coordenacao']);
        }
      },
      error: (error: any) => {
        console.error('Erro ao buscar Coordenador:', error);
        Swal.fire('Erro', 'Erro ao carregar dados do Coordenador.', 'error');
      },
    });
  }

  carregarDadosParaEdicao(coordenador: any): void {
    this.CoordenacaoDetaisForm.patchValue({
      nome: coordenador.nome,
      email: coordenador.email,
    });

    const cursosFormArray = this.cursosFormArray;
    cursosFormArray.clear();

    const cursosDoCoordenador =
      coordenador.cursosIds ||
      (coordenador.cursos
        ? coordenador.cursos.map((c: any) => c.id).filter((id: number) => !!id)
        : []);

    if (cursosDoCoordenador && Array.isArray(cursosDoCoordenador)) {
      cursosDoCoordenador.forEach((cursoId: number) => {
        cursosFormArray.push(this.formBuilder.control(cursoId));
      });
    }
  }

  loadCursosDisponiveis(): void {
    this.cursoService.getCursos().subscribe({
      next: (cursos) => {
        this.cursosDisponiveis = cursos;
      },
      error: (err) => {
        console.error('Erro ao buscar cursos:', err);
        Swal.fire(
          'Erro',
          'Não foi possível carregar a lista de cursos. Tente novamente mais tarde.',
          'error'
        );
      },
    });
  }

  get cursosFormArray() {
    return this.CoordenacaoDetaisForm.controls['cursosIds'] as FormArray;
  }

  hasError(controlName: string, errorName: string): boolean | undefined {
    return (
      this.CoordenacaoDetaisForm.get(controlName)?.hasError(errorName) &&
      this.CoordenacaoDetaisForm.get(controlName)?.touched
    );
  }

  onSubmit() {
    this.CoordenacaoDetaisForm.markAllAsTouched(); // Isso faz a mensagem vermelha aparecer (o que é bom)

    // --- 👇 CORREÇÃO ADICIONADA AQUI 👇 ---

    // 1. Verifica especificamente o erro do FormArray de Cursos
    if (this.cursosFormArray.hasError('required')) {
      Swal.fire(
        'Seleção Obrigatória',
        'Você deve selecionar pelo menos um curso.',
        'error'
      );
      return; // Para a execução aqui, exibindo o modal
    }

    // 2. Verifica se o restante do formulário (nome, email, senha) está inválido
    if (!this.CoordenacaoDetaisForm.valid) {
      console.log('Formulário Inválido (Campos de texto).');
      Swal.fire(
        'Campos Inválidos',
        'Por favor, corrija os erros em vermelho (Nome, Email ou Senha).',
        'error'
      );
      return; // Para a execução aqui
    }

    // --- FIM DA CORREÇÃO ---

    // Se passar pelas duas validações, o código de salvar continua
    console.log('Formulário Válido, pronto para salvar.'); // Mensagem removida do `if`

    const formValue = this.CoordenacaoDetaisForm.getRawValue();

    const coordenadorData: any = {
      nome: formValue.nome,
      email: formValue.email,
    };

    coordenadorData.cursosIds = formValue.cursosIds;

    if (!this.isEdicao || (this.isEdicao && formValue.senha)) {
      coordenadorData.senha = formValue.senha;
    }

    if (this.isEdicao && this.coordenadorIdentifier) {
      coordenadorData.id = Number(this.coordenadorIdentifier);

      this.coordenadorService.update(coordenadorData).subscribe({
        next: () => {
          console.log('Coordenador atualizado com sucesso!');
          Swal.fire(
            'Sucesso!',
            'Coordenador atualizado com sucesso.',
            'success'
          );
          this.router.navigate(['/funcionario-perfil']);
        },
        error: (error) => {
          console.error('Erro na atualização:', error);
          Swal.fire(
            'Erro',
            'Para que seja possivel editar, adicione a sua senha.',
            'error'
          );
        },
      });
    } else {
      this.coordenadorService.save(coordenadorData).subscribe({
        next: (response) => {
          console.log('Coordenador cadastrado com sucesso!', response);
          Swal.fire(
            'Sucesso!',
            'Coordenador cadastrado com sucesso!',
            'success'
          );
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          Swal.fire(
            'Erro',
            'Houve um erro no cadastro. Verifique os dados.',
            'error'
          );
        },
      });
    }
  }

  onCheckboxChange(event: any) {
    const isChecked = event.target.checked;
    const cursoId = event.target.value;

    if (isChecked) {
      this.cursosFormArray.push(this.formBuilder.control(Number(cursoId)));
    } else {
      const index = this.cursosFormArray.controls.findIndex(
        (x) => x.value === Number(cursoId)
      );
      if (index >= 0) {
        this.cursosFormArray.removeAt(index);
      }
    }
    this.cursosFormArray.markAsTouched();
  }

  goToLanding() {
    this.router.navigate(['/']);
  }
}
