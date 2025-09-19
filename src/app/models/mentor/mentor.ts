export class Mentor {
  id?: number;
  nome!: string;
  cpf!: string;
  email!: string;
  senha!: string;
  telefone!: string;
  tempoDeExperiencia!: string;
  statusMentor!: string;
  tipoDeVinculo!: TipoDeVinculo;
  areaDeAtuacao!: AreaDeAtuacao;
  endereco!: Endereco;
  reunioes?: any[];
}

export enum TipoDeVinculo {
  CLT = 'CLT',
  PJ = 'PJ',
  VOLUNTARIO = 'VOLUNTARIO',
}

export interface AreaDeAtuacao {
  id: number;
  nome?: string;
}

export interface Endereco {
  id?: number;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export enum StatusMentor {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  CONCLUIDO = 'CONCLUIDO',
}