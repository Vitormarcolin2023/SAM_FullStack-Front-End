import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-tela-cadastro',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tela-cadastro.component.html',
  styleUrl: './cadastro.scss'
})
export class TelaCadastroComponent implements OnInit {
   
  cadastroMentorForm!: FormGroup;

  constructor(private fb: FormBuilder) { } //Injetar o FormBuilder

  ngOnInit(): void { //Inicializando o formulário
    this.cadastroMentorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      companyName: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      additionalInformation: ['']
    });
  }

  onSubmit(): void { //Adicione o método onSubmit
    if (this.cadastroMentorForm.valid) {
      console.log('Formulário enviado!', this.cadastroMentorForm.value);
    } else {
      console.log('Formulário inválido.');
    }
  }

  onVoltar(): void { //Adicione o método onVoltar
    console.log('Botão Voltar clicado');
  }

}
