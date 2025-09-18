import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { LoginDto } from '../../../models/login/login-dto';
import { NavbarComponent } from "../../design/navbar/navbar.component";
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MdbFormsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  login: LoginDto = {
    email: '',
    senha: '',
    role: ''
  }
  loginService = inject(LoginService);
  router = inject(Router);


  logar() {

    // desabilita o botão para evitar diversas requisições
    const btnLogar = document.getElementById("btn-logar");
    this.estadoBotao(btnLogar, true);

    this.loginService.login(this.login).subscribe({
      next : token => {
        // setta o token em local storage para futuras requisições
        this.loginService.setToken(token);
        // habilita o bootão novamente
        this.estadoBotao(btnLogar, false);
        // redireciona o usuário para página inicial
        this.router.navigate(["tela-inicial"]);
      },
      error : erro => {
        // chama a função para mostrar o erro retornado do back para o usuário - o erro retorna no campo token da mensagem
       this.mostrarErro(erro.error.token);
       // chama a função para habilitar o botão novamente
       this.estadoBotao(btnLogar, false);

       // limpa os campos
       this.login = {
        email: '',
        senha: '',
        role: ''
       }

       this.loginService.deleteToken();
      }
    })
  }

  mostrarErro(erro: string){
    const quadroErro = document.getElementById("erro");

    if (quadroErro) {
      quadroErro.style.display = "flex";

      if(erro == undefined){
        quadroErro.innerText = "Não foi possível conectar ao servidor. Tente novamente mais tarde.";
      }
      else{
        quadroErro.innerText = `${erro}`;
      }
    }
  }

  estadoBotao(btn: any, desabilita: boolean){
    btn.disabled = desabilita;
    btn.innerText = desabilita ? "Carregando..." : "Acessar"
  }
}
