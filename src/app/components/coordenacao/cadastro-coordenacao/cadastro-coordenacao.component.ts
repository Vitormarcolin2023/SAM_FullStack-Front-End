import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CoordenadorService } from '../../../services/coordenador.service';
import { CursosService } from '../../../services/cursos.service';
import { Curso } from '../../../models/curso/curso';
import { UserdataService } from '../../../services/userdata.service';
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";

@Component({
  selector: 'app-cadastro-coordenacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, NavbarTelasInternasComponent],
  templateUrl: './cadastro-coordenacao.component.html',
  styleUrl: './cadastro-coordenacao.component.scss',
})
export class CadastroCoordenacaoComponent implements OnInit {
  cadastroCoordenadorForm!: FormGroup;
  coordenadorService = inject(CoordenadorService);
  cursoService = inject(CursosService);
  userDataService = inject(UserdataService);

  cursosDisponiveis: Curso[] = [];
  coordenadorId!: number;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.cadastroCoordenadorForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6)]],
      cursosIds: this.formBuilder.array([], Validators.required),
    });

    this.loadCursosDisponiveis();
    this.buscarDadosDoCoordenadorLogado();
  }

  private buscarDadosDoCoordenadorLogado(): void {
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
      this.coordenadorService.getCoordenadorPorEmail(emailDoToken).subscribe({
        next: (coordenador) => {
          if (coordenador) {
            console.log('Dados do coordenador para edição:', coordenador);
            this.coordenadorId = coordenador.id;

            this.cadastroCoordenadorForm.patchValue({
              nome: coordenador.nome,
              email: coordenador.email,
            });

            this.cadastroCoordenadorForm.get('senha')?.clearValidators();
            this.cadastroCoordenadorForm.get('senha')?.updateValueAndValidity();

            const cursosFormArray = this.cadastroCoordenadorForm.controls[
              'cursosIds'
            ] as FormArray;
            cursosFormArray.clear();

            const cursosDoCoordenador =
              coordenador.cursosIds ||
              (coordenador.cursos
                ? coordenador.cursos.map((c: any) => c.id)
                : []);

            if (cursosDoCoordenador && Array.isArray(cursosDoCoordenador)) {
              cursosDoCoordenador.forEach((cursoId: number) => {
                cursosFormArray.push(this.formBuilder.control(cursoId));
              });
            }
          } else {
            console.log('Coordenador não encontrado para edição.');
          }
        },
        error: (erro) => {
          console.error('Erro ao buscar dados do coordenador:', erro);
        },
      });
    } else {
      console.log(
        'Não foi possível obter o email para buscar o coordenador. Modo de cadastro ativo.'
      );
    }
  }

  carregarDadosParaEdicao(coordenador: any): void {
    console.log('Dados do coordenador para edição:', coordenador);

    this.coordenadorId = coordenador.id;

    this.cadastroCoordenadorForm.patchValue({
      nome: coordenador.nome,
      email: coordenador.email,
    });

    this.cadastroCoordenadorForm.get('senha')?.clearValidators();
    this.cadastroCoordenadorForm.get('senha')?.updateValueAndValidity();

    const cursosFormArray = this.cadastroCoordenadorForm.controls[
      'cursosIds'
    ] as FormArray;
    cursosFormArray.clear();

    const cursosDoCoordenador =
      coordenador.cursosIds ||
      (coordenador.cursos ? coordenador.cursos.map((c: any) => c.id) : []);

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

        const coordenadorLogado = this.userDataService.getCoordenador();
        if (coordenadorLogado) {
          this.carregarDadosParaEdicao(coordenadorLogado);
          console.log(coordenadorLogado);
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
  }

  hasError(controlName: string, errorName: string) {
    return (
      this.cadastroCoordenadorForm.get(controlName)?.hasError(errorName) &&
      this.cadastroCoordenadorForm.get(controlName)?.touched
    );
  }

  onSubmit() {
    if (this.cadastroCoordenadorForm.valid) {
      const coordenadorData = this.cadastroCoordenadorForm.value;

      if (this.coordenadorId) {
        const dadosParaAtualizar = {
          ...coordenadorData,
          id: this.coordenadorId,
        };
        
        console.log(dadosParaAtualizar);

        this.coordenadorService.update(dadosParaAtualizar).subscribe({
          next: () => {
            console.log('Coordenador atualizado com sucesso!');
            this.router.navigate(['/tela-inicial']);
          },
          error: () => {
            console.error('Erro na atualização:');
            alert(
              'Houve um erro na atualização. Por favor, verifique os dados e tente novamente.'
            );
          },
        });
      } else {
        this.coordenadorService.save(coordenadorData).subscribe({
          next: (response) => {
            console.log('Coordenador cadastrado com sucesso!', response);
            this.router.navigate(['/tela-inicial']);
          },
          error: (error) => {
            console.error('Erro no cadastro:', error);
            alert(
              'Houve um erro no cadastro. Por favor, verifique os dados e tente novamente.'
            );
          },
        });
      }
    }
  }

  goToLanding() {
    this.router.navigate(['/']);
  }
}
