import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { LoginService } from '../../../services/login.service';
import { LoginDto } from '../../../models/login-dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MdbFormsModule],
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


  logar() {
    this.loginService.login(this.login).subscribe({
      next : token => {
        console.log(token);
        this.loginService.setToken(token);
        console.log(this.loginService.getToken());

      },
      error : error => {
        console.error(error);
      }
    })
  }
}
