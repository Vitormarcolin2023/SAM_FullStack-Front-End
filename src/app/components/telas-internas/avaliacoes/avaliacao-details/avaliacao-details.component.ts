import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Avaliacao } from '../../../../models/avaliacao/avaliacao';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avaliacao-details',
  imports: [FormsModule, CommonModule],
  templateUrl: './avaliacao-details.component.html',
  styleUrls: ['./avaliacao-details.component.scss'],
})
export class AvaliacaoDetailsComponent {
  @Input() avaliacao!: Avaliacao;
  @Output() fechar = new EventEmitter<void>();

  perguntasComRespostas: {
    id: number;
    texto: string;
    resposta: string;
  }[] = [];

  opcoes = [
    { valor: 1, label: 'Discordo Totalmente' },
    { valor: 2, label: 'Discordo Parcialmente' },
    { valor: 3, label: 'Neutro' },
    { valor: 4, label: 'Concordo Parcialmente' },
    { valor: 5, label: 'Concordo Totalmente' },
  ];

  perguntas = [
    {
      id: 1,
      texto:
        'O meu mentor demonstrou experiência relevante em soluções de problemas.',
    },
    {
      id: 2,
      texto:
        'O mentor forneceu feedback claro e construtivo, que contribuiu diretamente para o meu desenvolvimento e aprendizado.',
    },
    {
      id: 3,
      texto:
        'As sessões de mentoria tiveram foco e foram adequadas para me ajudar a progredir em direção aos objetivos estabelecidos no PIE.',
    },
    {
      id: 4,
      texto:
        'O mentor se mostrou disponível para demandas pontuais e/ou agenda de reuniões regulares do PIE.',
    },
    {
      id: 5,
      texto:
        'Eu considero a experiência de mentoria exitosa no que se refere à solução desenvolvida para o projeto integrador!',
    },
    {
      id: 6,
      texto:
        'Eu considero a troca de experiências na mentoria exitosa para o desenvolvimento profissional e pessoal.',
    },
  ];

  respostas: number[] = [];

  getPerguntasComRespostas(avaliacao: any) {
    return this.perguntas.map((p, index) => {
      const respostaValor = avaliacao['resposta' + (index + 1)];
      const respostaLabel =
        this.opcoes.find((o) => o.valor === respostaValor)?.label || '—';
      return {
        ...p,
        resposta: respostaLabel,
      };
    });
  }

  ngOnInit() {
    this.perguntasComRespostas = this.getPerguntasComRespostas(this.avaliacao);
  }

  fecharModal() {
    this.fechar.emit();
  }
}
