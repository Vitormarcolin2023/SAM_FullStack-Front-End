import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfessorService } from '../../../services/professor/professor.service';
import { CursosService } from '../../../services/cursos.service';
import { UserdataService } from '../../../services/coordenacao/userdata.service';
import { Curso } from '../../../models/curso/curso';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../design/navbar/navbar.component";

@Component({
  selector: 'app-cadastro-professor',
  imports: [NavbarComponent, ReactiveFormsModule, NavbarComponent],
  templateUrl: './cadastro-professor.component.html',
  styleUrl: './cadastro-professor.component.scss'
})
export class CadastroProfessorComponent {
  cadastroProfessorForm!: FormGroup;
  professorService = inject(ProfessorService);
  cursoService = inject(CursosService);
  userDataService = inject(UserdataService);

  cursosDisponiveis: Curso[] = [];
  professorId!: number;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.cadastroProfessorForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6)]], 
      cursosIds: this.formBuilder.array([], Validators.required),
    });
    
    this.cadastroProfessorForm.get('senha')?.addValidators(Validators.required);
    this.cadastroProfessorForm.get('senha')?.updateValueAndValidity();


    this.loadCursosDisponiveis();
    this.buscarDadosDoProfessorLogado();
  }

  private buscarDadosDoProfessorLogado(): void {
    const token = localStorage.getItem('token');
    let emailDoToken = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        emailDoToken = payload.email ?? payload.sub ?? ''; 
      } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return;
      }
    }

    if (emailDoToken) {
      this.professorService.getProfessorPorEmail(emailDoToken).subscribe({
        next: (professor: any) => {
          if (professor) {
            this.carregarDadosParaEdicao(professor);
          } else {
            console.log('Professor não encontrado para edição.');
          }
        },
        error: (erro: any) => {
          console.error('Erro ao buscar dados do professor:', erro);
        },
      });
    } else {
      console.log('Não foi possível obter o email. Modo de cadastro ativo.');
    }
  }

  carregarDadosParaEdicao(professor: any): void {
    console.log('Dados do professor para edição:', professor);

    this.professorId = professor.id;

    this.cadastroProfessorForm.patchValue({
      nome: professor.nome,
      email: professor.email,
    });

    this.cadastroProfessorForm.get('senha')?.clearValidators();
    this.cadastroProfessorForm.get('senha')?.updateValueAndValidity();

    const cursosFormArray = this.cursosFormArray;
    cursosFormArray.clear();

    const cursosDoProfessor =
      professor.cursosIds ||
      (professor.cursos ? professor.cursos.map((c: any) => c.id) : []);

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
        const professorLogado = this.userDataService.getProfessor();
        if (professorLogado) {
          this.carregarDadosParaEdicao(professorLogado);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar cursos:', err);
        alert(
          'Não foi possível carregar a lista de cursos. Tente novamente mais tarde.'
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

  hasError(controlName: string, errorName: string) {
    return (
      this.cadastroProfessorForm.get(controlName)?.hasError(errorName) &&
      this.cadastroProfessorForm.get(controlName)?.touched
    );
  }

  onSubmit() {
    if (this.professorId && !this.cadastroProfessorForm.get('senha')?.value) {
      this.cadastroProfessorForm.get('senha')?.clearValidators();
      this.cadastroProfessorForm.get('senha')?.updateValueAndValidity();
    } else if (!this.professorId) {
       this.cadastroProfessorForm.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
       this.cadastroProfessorForm.get('senha')?.updateValueAndValidity();
    }


    if (this.cadastroProfessorForm.valid) {
      const professorData = this.cadastroProfessorForm.value;

      if (this.professorId) {
        if (!professorData.senha) {
            delete professorData.senha;
        }

        const dadosParaAtualizar = {
          ...professorData,
          id: this.professorId,
        };
        
        console.log('Dados para atualização (Professor):', dadosParaAtualizar);

        this.professorService.update(dadosParaAtualizar).subscribe({
          next: () => {
            console.log('Professor atualizado com sucesso!');
            this.router.navigate(['/tela-inicial']);
          },
          error: (error: any) => {
            console.error('Erro na atualização:', error);
            alert(
              'Houve um erro na atualização. Por favor, verifique os dados e tente novamente.'
            );
          },
        });
      } else {
        this.professorService.save(professorData).subscribe({
          next: (response: any) => {
            console.log('Professor cadastrado com sucesso!', response);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.error('Erro no cadastro:', error);
            alert(
              'Houve um erro no cadastro. Por favor, verifique os dados e tente novamente.'
            );
          },
        });
      }
    } else {
      this.cadastroProfessorForm.markAllAsTouched();
    }
  }

  goToLanding() {
    this.router.navigate(['/']);
  }
}