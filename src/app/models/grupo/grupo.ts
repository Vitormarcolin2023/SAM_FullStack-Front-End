import { Aluno } from "../aluno/aluno";
import { Professor } from "../professor/professor";
import { Projeto } from "../projeto/projeto";
import { Reuniao } from "../reuniao/reuniao";

export class Grupo {
  id?: number;
  nome: string;
  statusGrupo?: string;
  alunoAdmin?: Aluno;
  alunos?: Aluno[];
  reunioes?: Reuniao[];
  projetos?: Projeto[];
  professores?: Professor[];
    periodo?: string;

  constructor(
    nome: string,
    id?: number,
    statusGrupo?: string,
    alunoAdmin?: Aluno,
    alunos?: Aluno[],
    projetos?: Projeto[],
    professores?: Professor[],
    periodo?: string
  ) {
    this.id = id;
    this.nome = nome;
    this.statusGrupo = statusGrupo;
    this.alunoAdmin = alunoAdmin;
    this.alunos = alunos;
    this.projetos = projetos;
    this.professores = professores;
    this.periodo = periodo;
  }
}

export interface GrupoDto {
  nome: string;
  alunoAdminId: number;
  alunosIds: number[];
  professoresIds: number[];
  periodo: string;
}