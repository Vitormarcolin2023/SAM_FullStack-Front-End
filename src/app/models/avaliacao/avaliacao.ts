import { Aluno } from "../aluno/aluno";
import { Mentor } from "../mentor/mentor";
import { Projeto } from "../projeto/projeto";

export class Avaliacao {
    id?: number;
    resposta1: number;
    resposta2: number;
    resposta3: number;
    resposta4: number;
    resposta5: number;
    resposta6: number;
    media?: number;
    comentario: string;
    recomendacao: boolean;
    projeto: Projeto;
    aluno: Aluno;

    constructor(
        resposta1: number,
        resposta2: number,
        resposta3: number,
        resposta4: number,
        resposta5: number,
        resposta6: number,
        comentario: string,
        recomendacao: boolean,
        projeto: Projeto,
        aluno: Aluno,
    ) {
        this.resposta1 =resposta1;
        this.resposta2 = resposta2;
        this.resposta3 = resposta3;
        this.resposta4 = resposta4;
        this.resposta5 = resposta5;
        this.resposta6 = resposta6;
        this.comentario = comentario;
        this.recomendacao = recomendacao;
        this.projeto = projeto;
        this.aluno = aluno;
    }
}

export interface avaliacaoDTO {
    id: number;
    resposta1: number;
    resposta2: number;
    resposta3: number;
    resposta4: number;
    resposta5: number;
    resposta6: number;
    media: number;
    comentario: string;
    recomendacao: boolean;
    projeto: Projeto;
    aluno: Aluno;
}
