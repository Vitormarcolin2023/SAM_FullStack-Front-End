import { Aluno } from "../aluno/aluno";
import { Projeto } from "../projeto/projeto";
import { Reuniao } from "../reuniao/reuniao";

export class Grupo {
  id?: number;
  nome: string;
  alunoAdmin?: Aluno;
  alunos?: Aluno[];
  reunioes?: Reuniao[];
  projetos?: Projeto[];

  constructor(
    nome: string,
    id?: number,
    alunoAdmin?: Aluno,
    alunos?: Aluno[],
    reunioes?: Reuniao[],
    projetos?: Projeto[]
  ) {
    this.id = id;
    this.nome = nome;
    this.alunoAdmin = alunoAdmin;
    this.alunos = alunos;
    this.reunioes = reunioes;
    this.projetos = projetos;
  }
}

export interface GrupoDtoPayload {
  nome: string;
  alunoAdminId: number;
  alunosIds: number[];
}