import { Routes } from '@angular/router';

import { LoginComponent } from './components/telas-iniciais/login/login.component';
import { LandingpageComponent } from './components/telas-iniciais/landingpage/landingpage.component';
import { CadastroComponent } from './components/telas-iniciais/cadastro/cadastro.component';

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
      import('./components/telas-internas/tela-inicial/tela-inicial.component').then(
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
          import('./components/telas-internas/tela-inicial/tela-inicial.component').then(
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
