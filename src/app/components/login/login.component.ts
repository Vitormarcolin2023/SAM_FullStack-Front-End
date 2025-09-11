import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MdbFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
tipoUsuario: any;

  constructor(private router: Router) {}

  logar() {
    if (this.email === 'root' && this.senha === 'root') {
      this.router.navigate(['principal/pessoas']);
    } else {
      alert('Email ou senha inválidos!');
    }
  }
}

/*export class LoginComponent {
  tipoUsuario: string = ''; // select de tipo de usuário
  email: string = '';       // adicionado campo de email
  senha: string = '';

  constructor(private router: Router) {}

  // Método de login - ainda comentado para futuras implementações do grupo
  logar() {
    console.log("Tipo de usuário selecionado:", this.tipoUsuario);
    console.log("Email digitado:", this.email);
    console.log("Senha digitada:", this.senha);

    // Aqui futuramente será feita a integração com o backend para autenticação
    // Exemplo:
    // if (this.tipoUsuario === 'MENTOR' && this.email === 'root@sam.com' && this.senha === 'root') {
    //   this.router.navigate(['principal/pessoas']);
    // } else {
    //   alert('Tipo de usuário, email ou senha inválidos!');
    // }
  }
*/
