import { Curso } from "../curso/curso";
import { Projeto } from "../projeto/projeto";


export class Professor {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  cursos?: Curso[];
  projetos?: Projeto[];

  constructor(
    nome: string,
    email: string,
    senha: string,
    id?: number,
    cursos?: Curso[],
    projetos?: Projeto[]
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.cursos = cursos;
    this.projetos = projetos;
  }
}