import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { LoginService } from '../../../services/login.service';
import { LoginDto } from '../../../models/login/login-dto';
import { NavbarComponent } from '../../design/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,        // necessário para ngModel
    CommonModule,       // básico do Angular
    MdbFormsModule,     // necessário para mdb-form-control
    NavbarComponent     // necessário para app-navbar
  ],
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
  const btnLogar = document.getElementById("btn-logar") as HTMLButtonElement | null;
  if (btnLogar) btnLogar.disabled = true;

  this.loginService.login(this.login).subscribe({
    next: response => {
      const token = response.token;
      this.loginService.setToken(token);

      localStorage.setItem('role', response.role ?? ''); 
      localStorage.setItem('emailLogado', response.email ?? '');
      localStorage.setItem('mentorStatus', response.status ?? ''); 

      const role = (response.role ?? '').toUpperCase();
      const status = response.status;
      
      console.log('Valor da role:', role);
      console.log('Valor do status:', status);

      
      if (role === 'MENTOR' && status === 'CONCLUIDO') {
        this.router.navigate(['mentor-perfil']);
      } else if (role === 'MENTOR' && status === 'PENDENTE') {
        Swal.fire({
          icon: 'info',
          title: 'Perfil em Análise',
          text: 'A sua solicitação de perfil de mentor está em análise. Você será notificado quando a coordenação concluir a análise.',
          confirmButtonColor: '#4CAF50'
        });
      } else {
        this.router.navigate(['tela-inicial']);
      }

      if (btnLogar) btnLogar.disabled = false;
    },
    error: erro => {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao logar',
        text: erro.error?.message ?? 'Erro ao logar'
      });

      if (btnLogar) btnLogar.disabled = false;
      this.login = { email: '', senha: '', role: '' };
      this.loginService.deleteToken();
    }
  });
}

}
