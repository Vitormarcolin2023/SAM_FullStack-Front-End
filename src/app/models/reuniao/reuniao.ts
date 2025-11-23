import { Time } from "@angular/common";
import { Projeto } from "../projeto/projeto";


export enum FormatoReuniao {
  PRESENCIAL = 'PRESENCIAL',
  ONLINE = 'ONLINE',
}

export enum StatusReuniao {
ACEITO = 'ACEITO',
PENDENTE = 'PENDENTE',
  CANCELADO = 'CANCELADO',
  RECUSADO = 'RECUSADO',
}

export class Reuniao {
  id?: number;
  assunto: string;
  data: string;
  hora: string;
  formatoReuniao: FormatoReuniao;
  statusReuniao: StatusReuniao;
  projeto: Projeto;
  solicitadoPor: string;
  motivoRecusa: string;

  constructor(
    assunto: string,
    data: string,
    hora: string,
    formatoReuniao: FormatoReuniao,
    statusReuniao: StatusReuniao,
    solicitadoPor: string,
    projeto: Projeto,
    motivoRecusa: string,
    id?: number,
  ) {
    this.id = id;
    this.assunto = assunto;
    this.data = data;
    this.hora = hora;
    this.formatoReuniao = formatoReuniao;
    this.statusReuniao = statusReuniao;
    this.projeto = projeto;
    this.solicitadoPor = solicitadoPor;
    this.motivoRecusa = motivoRecusa;
  }
}

export interface ReuniaoDto {
  assunto: string;
  data: string;
  hora: string;
  formatoReuniao: FormatoReuniao;
  projeto_id: number;
  solicitadoPor: any;
}