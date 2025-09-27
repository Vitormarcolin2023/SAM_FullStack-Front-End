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
import { ProfessorService } from '../../../services/professor/professor.service';
import { CursosService } from '../../../services/cursos.service';
import { UserdataService } from '../../../services/coordenacao/userdata.service';
import Swal from 'sweetalert2';
import { Subscription, Observable } from 'rxjs';
import { NavbarComponent } from '../../design/navbar/navbar.component';
import { Curso } from '../../../models/curso/curso';

@Component({
  selector: 'app-cadastro-professor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent ],
  templateUrl: './cadastro-professor.component.html',
  styleUrl: './cadastro-professor.component.scss',
})
export class CadastroProfessorComponent implements OnInit, OnDestroy {
  cadastroProfessorForm!: FormGroup;
  professorService = inject(ProfessorService);
  cursoService = inject(CursosService);
  userDataService = inject(UserdataService);
  route = inject(ActivatedRoute);

  cursosDisponiveis: Curso[] = [];
  professorIdentifier: string | null = null; 
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

    this.cadastroProfessorForm = this.formBuilder.group({
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
        this.professorIdentifier = identifier;
        this.isEdicao = true;
        console.log(`Modo: Edição de Professor com identificador ${this.professorIdentifier} ativo.`);

        this.setupForm(true);
        this.loadProfessor(this.professorIdentifier);
      } else {
        this.isEdicao = false;
        this.professorIdentifier = null;
        this.setupForm(false);
        console.log('Modo: Cadastro de novo Professor ativo.');
      }
    });
  }
  
  private loadProfessor(identifier: string): void {
    
    let loadObservable: Observable<any>;
    
    if (isNaN(Number(identifier))) {
      loadObservable = this.professorService.getProfessorPorEmail(identifier);
    } else {
      loadObservable = this.professorService.getProfessorPorId(Number(identifier)); 
    }

    loadObservable.subscribe({
      next: (professor: any) => {
        if (professor) {
          if (professor.id) {
              this.professorIdentifier = professor.id.toString(); 
          }
          this.carregarDadosParaEdicao(professor);
        } else {
          console.error(`Professor com identificador ${identifier} não encontrado.`);
          Swal.fire('Erro', 'Professor não encontrado para edição.', 'error');
          this.router.navigate(['/cadastro-professor']); 
        }
      },
      error: (error: any) => {
        console.error('Erro ao buscar Professor:', error);
        Swal.fire('Erro', 'Erro ao carregar dados do Professor.', 'error');
      },
    });
  }

  carregarDadosParaEdicao(professor: any): void {
    this.cadastroProfessorForm.patchValue({
      nome: professor.nome,
      email: professor.email,
    });

    const cursosFormArray = this.cursosFormArray;
    cursosFormArray.clear();

    const cursosDoProfessor =
      professor.cursosIds ||
      (professor.cursos
        ? professor.cursos.map((c: any) => c.id).filter((id: number) => !!id)
        : []);
        
    if (cursosDoProfessor && Array.isArray(cursosDoProfessor)) {
      cursosDoProfessor.forEach((cursoId: number) => {
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
    return this.cadastroProfessorForm.controls['cursosIds'] as FormArray;
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
      this.cadastroProfessorForm.get(controlName)?.hasError(errorName) &&
      this.cadastroProfessorForm.get(controlName)?.touched
    );
  }

  onSubmit() {
    this.cadastroProfessorForm.markAllAsTouched();
    if (!this.cadastroProfessorForm.valid) {
        console.log('Formulário Inválido.');
        return;
    }

    const formValue = this.cadastroProfessorForm.getRawValue(); 
    
    const cursosParaBackend = formValue.cursosIds.map((id: number) => ({ id }));

    const professorData: any = {
      nome: formValue.nome,
      email: formValue.email,
      cursos: cursosParaBackend,
    };

    if (!this.isEdicao || (this.isEdicao && formValue.senha)) {
        professorData.senha = formValue.senha;
    }


    if (this.isEdicao && this.professorIdentifier) {
        professorData.id = Number(this.professorIdentifier);
        
        this.professorService.update(professorData).subscribe({
          next: () => {
            Swal.fire('Sucesso!', 'Professor atualizado com sucesso.', 'success');
            this.router.navigate(['/funcionario-perfil']); 
          },
          error: (error) => {
            console.error('Erro na atualização:', error);
            Swal.fire('Erro', 'Houve um erro na atualização. Verifique os dados.', 'error');
          },
        });
    } else {
      delete professorData.cursosIds; 
      
      this.professorService.save(professorData).subscribe({
        next: (response) => {
          Swal.fire('Sucesso!', 'Professor cadastrado com sucesso!', 'success');
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
