import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import {
  AreaDeAtuacao,
  Endereco,
  Mentor,
  TipoDeVinculo,
} from '../../../models/mentor/mentor';
import { MentorService } from '../../../services/mentores/mentores.service';
import { AreaDeAtuacaoService } from '../../../services/areaDeAtuacao/area-de-atuacao.service';
import { ViaCepService } from '../../../services/viaCep/via-cep.service';
@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {
  cadastroMentorForm!: FormGroup;
  formSubmitted = false;
  step: number = 1;
  isLoadingCep = false;

  areasDeAtuacao: AreaDeAtuacao[] = [];

  // Injeção de dependências moderna
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private mentorService = inject(MentorService);
  private areaDeAtuacaoService = inject(AreaDeAtuacaoService);
  private viaCepService = inject(ViaCepService);

  ngOnInit(): void {
    this.cadastroMentorForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      telefone: ['', Validators.required],
      cep: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      tempoDeExperiencia: [''],
      tipoDeVinculo: [TipoDeVinculo.CLT, Validators.required],
      areaDeAtuacao: [null, Validators.required],
    });

    this.loadAreasDeAtuacao();
  }

  loadAreasDeAtuacao(): void {
    this.areaDeAtuacaoService.findAll().subscribe({
      next: (data) => {
        this.areasDeAtuacao = data;
      },
      error: (err) => {
        console.error('Erro ao buscar áreas de atuação', err);
        Swal.fire(
          'Falha na Conexão',
          'Não foi possível carregar as áreas de atuação.',
          'error'
        );
      },
    });
  }

  buscarCep(): void {
    const cep = this.cadastroMentorForm.get('cep')?.value;
    if (cep && cep.replace(/\D/g, '').length === 8) {
      this.isLoadingCep = true;
      this.viaCepService
        .buscar(cep)
        .pipe(finalize(() => (this.isLoadingCep = false)))
        .subscribe({
          next: (data) => {
            if (!data.erro) {
              this.cadastroMentorForm.patchValue({
                rua: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
              });
            } else {
              Swal.fire(
                'CEP não encontrado',
                'Por favor, verifique o CEP digitado.',
                'error'
              );
            }
          },
          error: () =>
            Swal.fire('Erro', 'Não foi possível consultar o CEP.', 'error'),
        });
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.cadastroMentorForm.invalid) {
      this.cadastroMentorForm.markAllAsTouched();
      Swal.fire(
        'Atenção!',
        'Por favor, verifique os campos em vermelho.',
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Cadastrando Mentor...',
      text: 'Por favor, aguarde um momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const endereco: Endereco = {
      cidade: this.cadastroMentorForm.value.cidade,
      estado: this.cadastroMentorForm.value.estado,
      bairro: this.cadastroMentorForm.value.bairro,
      numero: this.cadastroMentorForm.value.numero,
      rua: this.cadastroMentorForm.value.rua,
      cep: this.cadastroMentorForm.value.cep,
    };

    const novoMentor: Mentor = {
      nome: this.cadastroMentorForm.value.nome,
      cpf: this.cadastroMentorForm.value.cpf,
      email: this.cadastroMentorForm.value.email,
      senha: this.cadastroMentorForm.value.senha,
      telefone: this.cadastroMentorForm.value.telefone,
      tempoDeExperiencia: this.cadastroMentorForm.value.tempoDeExperiencia,
      tipoDeVinculo: this.cadastroMentorForm.value.tipoDeVinculo,
      statusMentor: 'PENDENTE',
      endereco: endereco,
      areaDeAtuacao: { id: this.cadastroMentorForm.value.areaDeAtuacao },
    };

    this.mentorService.save(novoMentor).subscribe({
      next: (mentorSalvo) => {
       
        Swal.fire({
          icon: 'success',
          title: 'Cadastro Realizado!',
          text: `O mentor foi cadastrado com sucesso!`,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
      
        const errorMessage =
          err.error?.message ||
          'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.';
        Swal.fire({
          icon: 'error',
          title: 'Erro no Cadastro',
          text: errorMessage,
        });
        console.error(err);
      },
    });
  }

  // Funções de navegação e validação
  nextStep() {
    if (this.step < 3) this.step++;
  }
  prevStep() {
    if (this.step > 1) this.step--;
  }
  goToLanding() {
    this.router.navigate(['/landing']);
  }

  hasError(field: string, error: string) {
    const control = this.cadastroMentorForm.get(field);
    return (
      control &&
      (control.touched || this.formSubmitted) &&
      control.hasError(error)
    );
  }
}
