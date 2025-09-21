import { Curso } from "../curso/curso";

export class Coordenador {

    id!: number;
    nome!: string;
    email!: string;
    senha!: string;
    cursos!: Curso[];

}
