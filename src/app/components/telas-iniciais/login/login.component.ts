import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { LoginService } from '../../../services/login.service';
import { LoginDto } from '../../../models/login/login-dto';
import { NavbarComponent } from "../../design/navbar/navbar.component";

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
  };

  loginService = inject(LoginService);
  router = inject(Router);

  logar() {
    // desabilita o botão para evitar diversas requisições
    const btnLogar = document.getElementById("btn-logar");
    this.estadoBotao(btnLogar, true);

    this.loginService.login(this.login).subscribe({
      next: response => {
        // response vem do back no formato RespostaLoginDTO { token: "..." }
        const token = response.token;

        // salva o token
        this.loginService.setToken(token);

        // salva também role e email no localStorage (para uso futuro)
        localStorage.setItem('role', this.login.role ?? '');
        localStorage.setItem('emailLogado', this.login.email ?? '');

        // habilita o botão novamente
        this.estadoBotao(btnLogar, false);

        // redireciona conforme o role
        if ((this.login.role ?? '').toUpperCase() === 'MENTOR') {
          this.router.navigate(['perfil-mentor']);
        } else {
          this.router.navigate(['tela-inicial']);
        }
      },
      error: erro => {
        // mostra mensagem de erro retornada do back
        this.mostrarErro(erro.error?.token ?? erro.error?.message);

        // habilita o botão novamente
        this.estadoBotao(btnLogar, false);

        // limpa os campos de login
        this.login = {
          email: '',
          senha: '',
          role: ''
        };

        this.loginService.deleteToken();
      }
    });
  }

  mostrarErro(erro: string) {
    const quadroErro = document.getElementById("erro");

    if (quadroErro) {
      quadroErro.style.display = "flex";

      if (erro == undefined) {
        quadroErro.innerText = "Não foi possível conectar ao servidor. Tente novamente mais tarde.";
      } else {
        quadroErro.innerText = `${erro}`;
      }
    }
  }

  estadoBotao(btn: any, desabilita: boolean) {
    btn.disabled = desabilita;
    btn.innerText = desabilita ? "Carregando..." : "Acessar";
  }
}
