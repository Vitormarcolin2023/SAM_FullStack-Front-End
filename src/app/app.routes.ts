import { Routes } from '@angular/router';

import { LoginComponent } from './components/design/login/login.component';
import { LandingpageComponent } from './components/design/landingpage/landingpage.component';
import { CadastroComponent } from './components/design/cadastro/cadastro.component';

// Layout com sidebar
import { DashboardDesignComponent } from './components/design/dashboard-design/dashboard-design.component';

export const routes: Routes = [
  // Páginas sem sidebar
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: '', component: LandingpageComponent }, // raiz = landing
  { path: 'cadastro', component: CadastroComponent },

  // Páginas com sidebar
  {
    path: 'tela-inicial',
    loadComponent: () =>
      import('./components/design/tela-inicial/tela-inicial.component').then(
        m => m.TelaInicialComponent
      )
  },
  {
    path: 'dashboard',
    component: DashboardDesignComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./components/design/tela-inicial/tela-inicial.component').then(
            m => m.TelaInicialComponent
          )
      }
      // aqui você adiciona outras páginas filhas do dashboard
      // ex:
      // { path: 'perfil', loadComponent: () => import('./components/design/perfil/perfil.component').then(m => m.PerfilComponent) }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
