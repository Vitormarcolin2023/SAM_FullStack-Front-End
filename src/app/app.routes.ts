import { Routes } from '@angular/router';
import { LoginComponent } from './components/design/login/login.component';
import { LandingpageComponent } from './components/design/landingpage/landingpage.component';
import { CadastroComponent } from './components/design/cadastro/cadastro.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: '', component: LandingpageComponent },
  { path: 'cadastro', component: CadastroComponent }, // mover antes do '**'
  { path: '**', redirectTo: '' } // fallback
];
