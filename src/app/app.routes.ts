import { Routes } from '@angular/router';

// Páginas públicas (sem sidebar)
import { LoginComponent } from './components/telas-iniciais/login/login.component';
import { LandingpageComponent } from './components/telas-iniciais/landingpage/landingpage.component';
import { CadastroComponent } from './components/telas-iniciais/cadastro/cadastro.component';

// Páginas privadas (com sidebar)
import { TelaInicialComponent } from './components/telas-internas/tela-inicial/tela-inicial.component';
import { MentorPerfilComponent } from './components/telas-internas/mentor-perfil/mentor-perfil.component';
import { mentorStatusGuard } from './guards/mentor-status.guard';
import { CriarGrupoComponent } from './components/telas-internas/grupo/criar-grupo/criar-grupo.component';

import { AtivarmentorComponent } from './components/coordenacao/ativarmentor.component';
import { VisualizarprojetosComponent } from './components/coordenacao/visualizarprojetos/visualizarprojetos.component';
import { CadastroCoordenacaoComponent } from './components/coordenacao/cadastro-coordenacao/cadastro-coordenacao.component';
import { GrupoDetailsComponent } from './components/telas-internas/grupo/grupo-details/grupo-details.component';
import { AlunoPrincipalComponent } from './components/telas-internas/aluno-principal/aluno-principal.component';
import { AlunoBemVindoComponent } from './components/telas-internas/aluno-principal/aluno-bem-vindo/aluno-bem-vindo.component';
import { AlunoPerfilComponent } from './components/telas-internas/aluno-principal/aluno-perfil/aluno-perfil.component';
import { AlunoDetaisComponent } from './components/telas-internas/aluno-principal/aluno-detais/aluno-detais.component';

export const routes: Routes = [
  // Páginas iniciais
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: '', component: LandingpageComponent }, // raiz = landinzg
  { path: 'cadastro', component: CadastroComponent },

  // Páginas internas
  {
    path: 'tela-inicial',
    component: TelaInicialComponent,
    children: [
      { path: 'ativar-mentor', component: AtivarmentorComponent },
      { path: 'visualizar-projetos', component: VisualizarprojetosComponent },
    ],
  },
  { path: 'mentor-perfil', component: MentorPerfilComponent },
  {
    path: 'aluno',
    component: AlunoPrincipalComponent,
    children: [
      { path: 'aluno-bem-vindo', component: AlunoBemVindoComponent },
      { path: 'aluno-perfil', component: AlunoPerfilComponent },
      { path: 'aluno-editar/:email', component: AlunoDetaisComponent },
    ],
  },

  // Rota protegida por guard (mentorStatusGuard)
  {
    path: 'mentor-perfil',
    component: MentorPerfilComponent,
    canActivate: [mentorStatusGuard],
  },
  { path: 'cadastro-coordenacao', component: CadastroCoordenacaoComponent },

  // Fallback (rota não encontrada)
  {
    path: 'grupo-details',
    component: GrupoDetailsComponent,
    canActivate: [mentorStatusGuard],
  },

  {
    path: 'criar-grupo',
    component: CriarGrupoComponent,
    canActivate: [mentorStatusGuard],
  },

  // Fallback (rota não encontrada) //nao adicionar paginas embaixo dessa linha se nao nao funciona
  { path: '**', redirectTo: '' },
];
