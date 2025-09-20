import { Grupo } from "../grupo/grupo";
import { Mentor } from "../mentor/mentor";


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
  mentor?: Mentor;
  grupo?: Grupo;

  constructor(
    assunto: string,
    data: string,
    hora: string,
    formatoReuniao: FormatoReuniao,
    statusReuniao: StatusReuniao,
    id?: number,
    mentor?: Mentor,
    grupo?: Grupo
  ) {
    this.id = id;
    this.assunto = assunto;
    this.data = data;
    this.hora = hora;
    this.formatoReuniao = formatoReuniao;
    this.statusReuniao = statusReuniao;
    this.mentor = mentor;
    this.grupo = grupo;
  }
}