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

  estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
  tiposVinculo = ['PENDENTE_APROVACAO', 'COMPLETO'];
  areasAtuacao = ['TI', 'Saúde', 'Educação', 'Engenharia', 'Outros']; // Exemplo

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cadastroMentorForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      telefone: ['', Validators.required],
      cidade: [''],
      estado: [''],
      bairro: [''],
      numero: [''],
      rua: [''],
      cep: [''],
      tempoExperiencia: [''],
      areaAtuacao: [''],
      tipoVinculo: ['PENDENTE_APROVACAO']
    });
  }

  onSubmit(): void {
    if (this.cadastroMentorForm.valid) {
      console.log('Formulário enviado!', this.cadastroMentorForm.value);
      // Aqui você pode chamar o service para enviar os dados para a API
    } else {
      console.log('Formulário inválido.');
      this.cadastroMentorForm.markAllAsTouched(); // marca todos os campos para exibir erros
    }
  }

  onVoltar(): void {
    console.log('Botão Voltar clicado');
    // Aqui você pode navegar para outra página se quiser
  }

  // Função auxiliar para facilitar verificação de erro no template
  hasError(field: string, error: string) {
    const control = this.cadastroMentorForm.get(field);
    return control && control.touched && control.hasError(error);
  }
}
