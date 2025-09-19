import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../design/navbar/navbar.component';
import { CoordenadorService } from '../../../services/coordenador.service';
import { CursosService } from '../../../services/cursos.service';
import { Curso } from '../../../models/curso/curso';

@Component({
  selector: 'app-cadastro-coordenacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './cadastro-coordenacao.component.html',
  styleUrl: './cadastro-coordenacao.component.scss'
})
export class CadastroCoordenacaoComponent implements OnInit {

  cadastroCoordenadorForm!: FormGroup;
  coordenadorService = inject(CoordenadorService);
  cursoService = inject(CursosService);

  cursosDisponiveis: Curso[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 1. O nome do FormArray é 'cursosIds', que bate com o DTO do backend.
    this.cadastroCoordenadorForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      cursosIds: this.formBuilder.array([], Validators.required)
    });

    this.loadCursosDisponiveis();
  }

  loadCursosDisponiveis(): void {
    this.cursoService.getCursos().subscribe({
      next: (cursos) => {
        this.cursosDisponiveis = cursos;
      },
      error: (err) => {
        console.error('Erro ao buscar cursos:', err);
        alert('Não foi possível carregar a lista de cursos. Tente novamente mais tarde.');
      }
    });
  }

  // 2. Agora o getter retorna o FormArray com o nome correto 'cursosIds'
  get cursosFormArray() {
    return this.cadastroCoordenadorForm.controls['cursosIds'] as FormArray;
  }

  // 3. O método de manipulação do checkbox agora usa o FormArray correto.
  onCheckboxChange(event: any) {
    const isChecked = event.target.checked;
    const cursoId = event.target.value;

    if (isChecked) {
      this.cursosFormArray.push(this.formBuilder.control(Number(cursoId)));
    } else {
      const index = this.cursosFormArray.controls.findIndex(x => x.value === Number(cursoId));
      if (index >= 0) {
        this.cursosFormArray.removeAt(index);
      }
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.cadastroCoordenadorForm.get(controlName)?.hasError(errorName) && this.cadastroCoordenadorForm.get(controlName)?.touched;
  }

  // 4. O método onSubmit foi simplificado para pegar os dados diretamente do formulário.
  onSubmit() {
    if (this.cadastroCoordenadorForm.valid) {
      // O objeto já está no formato correto no .value do formulário.
      // O FormArray 'cursosIds' já está presente.
      const coordenadorData = this.cadastroCoordenadorForm.value;
      
      this.coordenadorService.save(coordenadorData).subscribe({
        next: (response) => {
          console.log('Coordenador cadastrado com sucesso!', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          alert('Houve um erro no cadastro. Por favor, verifique os dados e tente novamente.');
        }
      });
    }
  }

  goToLanding() {
    this.router.navigate(['/']);
  }
}