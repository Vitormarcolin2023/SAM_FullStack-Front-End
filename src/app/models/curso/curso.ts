import { Aluno } from '../aluno/aluno';
import { Coordenador } from '../coordenacao/coordenador';
import { AreaDeAtuacao } from '../mentor/mentor';
import { Professor } from '../professor/professor';


export interface Curso {
  id?: number;
  nome: string;
  areaDeAtuacao: AreaDeAtuacao;
  alunos?: Aluno[];
  coordenador?: Coordenador;
  professores?: Professor[];
}