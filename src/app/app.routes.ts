import { Routes } from '@angular/router';
import { LoginComponent } from './components/design/login/login.component';
import { LandingpageComponent } from './components/design/landingpage/landingpage.component';
import { TelaCadastroComponent } from './components/design/cadastro/cadastroTela'



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: '', component: LandingpageComponent },
  { path: '**', redirectTo: '' }, // fallback (se digitar rota errada, volta pra landing)
  { path: 'cadastro', component: TelaCadastroComponent }
];
