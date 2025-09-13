import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  cadastroMentorForm!: FormGroup;
  formSubmitted = false;
  step: number = 1; // etapa atual (1 = dados pessoais, 2 = endereço, 3 = vínculo)

  estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT',
    'MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO',
    'RR','SC','SP','SE','TO'
  ];
  tiposVinculo = ['PENDENTE_APROVACAO', 'COMPLETO'];
  areasAtuacao = ['TI', 'Saúde', 'Educação', 'Engenharia', 'Outros'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cadastroMentorForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      telefone: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      bairro: ['', Validators.required],
      numero: ['', Validators.required],
      rua: ['', Validators.required],
      cep: ['', Validators.required],
      tempoExperiencia: ['', Validators.required],
      areaAtuacao: ['', Validators.required],
      tipoVinculo: ['PENDENTE_APROVACAO']
    });
  }

  // 🔹 Mock dos métodos para não quebrar
  nextStep(): void {
    if (this.step < 3) {
      this.step++;
    }
    console.log('Avançou para step:', this.step);
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
    console.log('Voltou para step:', this.step);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.cadastroMentorForm.valid) {
      console.log('Formulário enviado!', this.cadastroMentorForm.value);
    } else {
      console.log('Formulário inválido.');
      this.cadastroMentorForm.markAllAsTouched();
    }
  }

  hasError(field: string, error: string) {
    const control = this.cadastroMentorForm.get(field);
    return control && (control.touched || this.formSubmitted) && control.hasError(error);
  }
}
