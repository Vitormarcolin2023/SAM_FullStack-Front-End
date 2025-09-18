import { Routes } from '@angular/router';

// Páginas públicas (sem sidebar)
import { LoginComponent } from './components/telas-iniciais/login/login.component';
import { LandingpageComponent } from './components/telas-iniciais/landingpage/landingpage.component';
import { CadastroComponent } from './components/telas-iniciais/cadastro/cadastro.component';

// Páginas privadas (com sidebar)
import { TelaInicialComponent } from './components/telas-internas/tela-inicial/tela-inicial.component';
import { MentorPerfilComponent } from './components/telas-internas/mentor-perfil/mentor-perfil.component';
import { AtivarmentorComponent } from './components/coordenacao/ativarmentor.component';
import { VisualizarprojetosComponent } from './components/coordenacao/visualizarprojetos/visualizarprojetos.component';


export const routes: Routes = [
  // Páginas iniciais
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: '', component: LandingpageComponent }, // raiz = landing
  { path: 'cadastro', component: CadastroComponent },

  // Páginas internas
  { path: 'tela-inicial', component: TelaInicialComponent, children: [
    { path: 'ativar-mentor', component: AtivarmentorComponent},
    { path: 'visualizar-projetos', component: VisualizarprojetosComponent}
  ] },
  { path: 'mentor-perfil', component: MentorPerfilComponent },
  

 
  // Fallback (rota não encontrada)
  { path: '**', redirectTo: '' }
];
