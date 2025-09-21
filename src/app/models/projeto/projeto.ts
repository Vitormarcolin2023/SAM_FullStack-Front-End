import { Grupo } from "../grupo/grupo";
import { AreaDeAtuacao, Mentor } from "../mentor/mentor";
import { Professor } from "../professor/professor";

export class Projeto {
  id?: number;
  nomeDoProjeto!: string;
  descricao!: string;
  areaDeAtuacao!: AreaDeAtuacao;
  dataInicioProjeto!: string; // ou Date
  dataFinalProjeto!: string; // ou Date
  periodo!: string;
  mentor?: Mentor;
  statusProjeto?: string;
  grupo?: Grupo;
  professores?: Professor[];

  constructor(
    nomeDoProjeto: string = '',
    descricao: string = '',
    areaDeAtuacao: AreaDeAtuacao = {} as AreaDeAtuacao,
    dataInicioProjeto: string = '',
    dataFinalProjeto: string = '',
    periodo: string = '',
    id?: number,
    mentor?: Mentor,
    statusProjeto?: string,
    grupo?: Grupo,
    professores?: Professor[]
  ) {
    this.id = id;
    this.nomeDoProjeto = nomeDoProjeto;
    this.descricao = descricao;
    this.areaDeAtuacao = areaDeAtuacao;
    this.dataInicioProjeto = dataInicioProjeto;
    this.dataFinalProjeto = dataFinalProjeto;
    this.periodo = periodo;
    this.mentor = mentor;
    this.statusProjeto = statusProjeto;
    this.grupo = grupo;
    this.professores = professores;
  }
}