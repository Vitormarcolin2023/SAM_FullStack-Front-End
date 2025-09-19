import { Curso } from "../curso/curso";
import { Grupo } from "../grupo/grupo";

export enum StatusAlunoGrupo {
  ATIVO = 'ATIVO',
  AGUARDANDO = 'AGUARDANDO',
}

export class Aluno {
  id?: number;
  nome: string;
  ra: number;
  senha: string;
  email: string;
  curso: Curso;
  statusAlunoGrupo: StatusAlunoGrupo;
  grupo?: Grupo;

  constructor(
    nome: string,
    ra: number,
    senha: string,
    email: string,
    curso: Curso,
    statusAlunoGrupo: StatusAlunoGrupo,
    id?: number,
    grupo?: Grupo
  ) {
    this.id = id;
    this.nome = nome;
    this.ra = ra;
    this.senha = senha;
    this.email = email;
    this.curso = curso;
    this.statusAlunoGrupo = statusAlunoGrupo;
    this.grupo = grupo;
  }
}