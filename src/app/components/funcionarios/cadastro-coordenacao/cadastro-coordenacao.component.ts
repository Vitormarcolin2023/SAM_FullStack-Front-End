import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoordenadorService } from '../../../services/coordenacao/coordenador.service';
import { CursosService } from '../../../services/cursos.service';
import { UserdataService } from '../../../services/coordenacao/userdata.service';
import { NavbarComponent } from "../../design/navbar/navbar.component";
import Swal from 'sweetalert2';
import { Subscription, Observable } from 'rxjs';
import { Curso } from '../../../models/curso/curso';

@Component({
  selector: 'app-cadastro-coordenacao',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule ],
  templateUrl: './cadastro-coordenacao.component.html',
  styleUrl: './cadastro-coordenacao.component.scss',
})
export class CadastroCoordenacaoComponent implements OnInit, OnDestroy {
  cadastroCoordenadorForm!: FormGroup;
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

    this.cadastroCoordenadorForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: [{ value: '', disabled: isEdicao }, [Validators.required, Validators.email]], 
      senha: ['', senhaValidators], 
      cursosIds: this.formBuilder.array([], Validators.required),
    });
  }

  private checkRouteParams(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const email = params.get('email'); 
      const id = params.get('id');

      const identifier = email || id;

      if (identifier) {
        this.coordenadorIdentifier = identifier;
        this.isEdicao = true;
        console.log(`Modo: Edição de Coordenador com identificador ${this.coordenadorIdentifier} ativo.`);

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
      loadObservable = this.coordenadorService.getCoordenadorPorEmail(identifier);
    } else {
      loadObservable = this.coordenadorService.getCoordenadorPorId(Number(identifier)); 
    }

    loadObservable.subscribe({
      next: (coordenador: any) => {
        if (coordenador) {
          if (coordenador.id) {
              this.coordenadorIdentifier = coordenador.id.toString(); 
          }
          this.carregarDadosParaEdicao(coordenador);
        } else {
          console.error(`Coordenador com identificador ${identifier} não encontrado.`);
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
    
    this.cadastroCoordenadorForm.patchValue({
      nome: coordenador.nome,
      email: coordenador.email,
    });
    
    const cursosFormArray = this.cursosFormArray;
    cursosFormArray.clear();

    const cursosDoCoordenador =
      coordenador.cursosIds ||
      (coordenador.cursos ? coordenador.cursos.map((c: any) => c.id).filter((id: number) => !!id) : []);

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
    return this.cadastroCoordenadorForm.controls['cursosIds'] as FormArray;
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

  hasError(controlName: string, errorName: string): boolean | undefined {
    return (
      this.cadastroCoordenadorForm.get(controlName)?.hasError(errorName) &&
      this.cadastroCoordenadorForm.get(controlName)?.touched
    );
  }

  onSubmit() {
    this.cadastroCoordenadorForm.markAllAsTouched();
    if (!this.cadastroCoordenadorForm.valid) {
        console.log('Formulário Inválido.');
        return;
    }
    
    const formValue = this.cadastroCoordenadorForm.getRawValue(); 
    
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
          Swal.fire('Sucesso!', 'Coordenador atualizado com sucesso.', 'success');
          this.router.navigate(['/funcionario-perfil']);
        },
        error: (error) => {
          console.error('Erro na atualização:', error);
          Swal.fire('Erro', 'Houve um erro na atualização. Verifique os dados.', 'error');
        },
      });
    } else {
      this.coordenadorService.save(coordenadorData).subscribe({
        next: (response) => {
          console.log('Coordenador cadastrado com sucesso!', response);
          Swal.fire('Sucesso!', 'Coordenador cadastrado com sucesso!', 'success');
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          Swal.fire('Erro', 'Houve um erro no cadastro. Verifique os dados.', 'error');
        },
      });
    }
  }

  goToLanding() {
    this.router.navigate(['/']);
  }
}
