import { Curso } from "../curso/curso";

export class AreaDeAtuacao {
  id?: number;
  nome?: string;
  cursos?: Curso[];

  constructor(id: number | undefined, nome: string, cursos: Curso[] | undefined) {
    this.id = id;
    this.nome = nome;
    this.cursos = cursos;
  }
}