import { Routes } from '@angular/router';

// Páginas públicas (sem sidebar)
import { LoginComponent } from './components/telas-iniciais/login/login.component';
import { LandingpageComponent } from './components/telas-iniciais/landingpage/landingpage.component';
import { CadastroComponent } from './components/telas-iniciais/cadastro/cadastro.component';

// Layout interno (com sidebar e navbar internas)
import { DashboardDesignComponent } from './components/design/dashboard-design/dashboard-design.component';

export const routes: Routes = [
  // Páginas iniciais
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: '', component: LandingpageComponent }, // raiz = landing
  { path: 'cadastro', component: CadastroComponent },

  // Páginas internas diretas (sem layout wrapper)
  {
    path: 'tela-inicial',
    loadComponent: () =>
      import('./components/telas-internas/tela-inicial/tela-inicial.component').then(
        m => m.TelaInicialComponent
      )
  },

  // Páginas internas com layout (sidebar + navbar)
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
      },
      // Exemplo futuro: perfil
      /*
      {
        path: 'perfil',
        loadComponent: () =>
          import('./components/design/perfil/perfil.component').then(
            m => m.PerfilComponent
          )
      }
      */
    ]
  },

  
  // Fallback (rota não encontrada)
  { path: '**', redirectTo: '' }
];
