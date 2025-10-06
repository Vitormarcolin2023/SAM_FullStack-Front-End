import { Aluno } from "../aluno/aluno";
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

  constructor(
    nome: string,
    id?: number,
    statusGrupo?: string,
    alunoAdmin?: Aluno,
    alunos?: Aluno[],
    reunioes?: Reuniao[],
    projetos?: Projeto[]
  ) {
    this.id = id;
    this.nome = nome;
    this.statusGrupo = statusGrupo;
    this.alunoAdmin = alunoAdmin;
    this.alunos = alunos;
    this.reunioes = reunioes;
    this.projetos = projetos;
  }
}

export interface GrupoDto {
  nome: string;
  alunoAdminId: number;
  alunosIds: number[];
}