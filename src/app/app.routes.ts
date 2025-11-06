import { Routes } from '@angular/router';

// Páginas públicas (sem sidebar)
import { LoginComponent } from './components/telas-iniciais/login/login.component';
import { LandingpageComponent } from './components/telas-iniciais/landingpage/landingpage.component';
import { CadastroComponent } from './components/telas-iniciais/cadastro/cadastro.component';

// Páginas privadas (com sidebar)
import { TelaInicialComponent } from './components/telas-internas/tela-inicial/tela-inicial.component';
import { MentorPerfilComponent } from './components/telas-internas/mentor/mentor-perfil/mentor-perfil.component';
import { mentorStatusGuard } from './guards/mentor-status.guard';
import { CriarGrupoComponent } from './components/telas-internas/grupo/criar-grupo/criar-grupo.component';

import { VisualizarprojetosComponent } from './components/funcionarios/visualizarprojetos/visualizarprojetos.component';
import { GrupoDetailsComponent } from './components/telas-internas/grupo/grupo-details/grupo-details.component';
import { AlunoPrincipalComponent } from './components/telas-internas/aluno-principal/aluno-principal.component';
import { AlunoPerfilComponent } from './components/telas-internas/aluno-principal/aluno-perfil/aluno-perfil.component';
import { AlunoDetaisComponent } from './components/telas-internas/aluno-principal/aluno-detais/aluno-detais.component';
import { MentorEditComponent } from './components/telas-internas/mentor/mentor-edit/mentor-edit.component';
import { GrupoComponent } from './components/telas-internas/grupo/grupo.component';

import { VisualProjetoComponent } from './components/telas-internas/visual-projeto/visual-projeto.component';
import { CriarProjetoComponent } from './components/telas-internas/criar-projeto/criar-projeto.component';
import { ProjetoDetalhesComponent } from './components/telas-internas/projeto-detalhes/projeto-detalhes.component';
import { ProjetosMentorComponent } from './components/telas-internas/mentor/projetos-mentor/projetos-mentor.component';
import { FuncionarioComponent } from './components/funcionarios/perfil/funcionario-perfil.component';
import { CadastroProfessorComponent } from './components/funcionarios/cadastro-professor/cadastro-professor.component';
import { CadastroCoordenacaoComponent } from './components/funcionarios/cadastro-coordenacao/cadastro-coordenacao.component';
import { ListarMentorComponent } from './components/funcionarios/listarmentor/listarmentor.component';
import { AprovarMentorComponent } from './components/telas-internas/mentor/aprovar-mentor/aprovar-mentor.component';
import { AceiteDeMentoriaPerfilComponent } from './components/telas-internas/mentor/aprovar-mentor/aceite-de-mentoria-perfil/aceite-de-mentoria-perfil.component';
import { AceiteDeMentoriaDetaisComponent } from './components/telas-internas/mentor/aprovar-mentor/aceite-de-mentoria-detais/aceite-de-mentoria-detais.component';


export const routes: Routes = [
  // Páginas iniciais
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: '', component: LandingpageComponent }, // raiz = landinzg
  { path: 'cadastro', component: CadastroComponent },

  // Páginas interna
  {
    path: 'tela-inicial',
    component: TelaInicialComponent,
    children: [
      { path: 'listar-mentor', component: ListarMentorComponent },
      { path: 'visualizar-projetos', component: VisualizarprojetosComponent },
    ],
  },
  { path: 'mentor-perfil', component: MentorPerfilComponent },

  // Rotas do Aluno
  {
    path: 'aluno',
    component: AlunoPrincipalComponent,
    children: [
      { path: 'aluno-perfil', component: AlunoPerfilComponent },
      { path: 'aluno-editar/:email', component: AlunoDetaisComponent },
    ],
  },
  {
    path: 'grupo',
    component: GrupoComponent,
    children: [
      {
        path: 'grupo-details',
        component: GrupoDetailsComponent,
      },

      {
        path: 'criar-grupo',
        component: CriarGrupoComponent,
      },
    ],
  },

  // Rota protegida por guard (mentorStatusGuard)
  {
    path: 'mentor-perfil',
    component: MentorPerfilComponent,
    canActivate: [mentorStatusGuard],
  },
  {
    path: 'editar-mentor',
    component: MentorEditComponent,
  },

  {
    path: 'mentor/visualizar-projetos',
    component: ProjetosMentorComponent,
  },

  //Aceite de mentoria
  {
    path: 'aprovar-mentoria',
    component: AprovarMentorComponent,
    children: [
      {
        path: 'painel-de-mentorias',
        component: AceiteDeMentoriaPerfilComponent,
      },
      {
        path: 'detalhes-do-projeto',
        component: AceiteDeMentoriaDetaisComponent,
      },
    ],
  },

  {
    path: 'cadastro-coordenacao/:email',
    component: CadastroCoordenacaoComponent,
  },
  { path: 'cadastro-coordenacao', component: CadastroCoordenacaoComponent },
  { path: 'cadastro-professor/:email', component: CadastroProfessorComponent },
  { path: 'cadastro-professor', component: CadastroProfessorComponent },
  { path: 'funcionario-perfil', component: FuncionarioComponent },

  { path: 'visual-projeto', component: VisualProjetoComponent },
  { path: 'criar-projeto', component: CriarProjetoComponent },
  { path: 'projeto-detalhes', component: ProjetoDetalhesComponent },
  { path: 'projetos/:id', component: ProjetoDetalhesComponent },
  { path: 'editar-projeto/:id', component: CriarProjetoComponent },

  // Rota protegida pelo mentorStatusGuard
  {
    path: 'mentor-perfil',
    component: MentorPerfilComponent,
    canActivate: [mentorStatusGuard],
  },

  // Fallback (rota não encontrada)

  // Fallback (rota não encontrada) //nao adicionar paginas embaixo dessa linha se nao nao funciona
  { path: '**', redirectTo: '' },
];
