
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avaliacoes-alunos',
  imports: [FormsModule],
  templateUrl: './avaliacoes-alunos.component.html',
  styleUrl: './avaliacoes-alunos.component.scss',
})
export class AvaliacoesAlunosComponent {
  isLoading = false;
  avaliacaoEnviada = false;
  avaliacaoTentada = false;

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

  opcoes = [
    { valor: 1, label: 'Discordo Totalmente' },
    { valor: 2, label: 'Discordo Parcialmente' },
    { valor: 3, label: 'Neutro' },
    { valor: 4, label: 'Concordo Parcialmente' },
    { valor: 5, label: 'Concordo Totalmente' },
  ];

  respostas: { [key: number]: number } = {};
  comentarios = '';
  recomendacao!: boolean;

  isRecomendado(resposta: boolean) {
    this.recomendacao = resposta;
  }

  enviarAvaliacao() {
    this.avaliacaoTentada = true;

    const todasRespondidas =
      Object.keys(this.respostas).length === this.perguntas.length &&
      this.recomendacao !== undefined;

    if (!todasRespondidas) {
      return;
    }

    this.avaliacaoEnviada = true;

    const dados = {
      respostas: this.respostas,
      comentarios: this.comentarios,
      recomendacao: this.recomendacao,
    };

    console.log('Avaliação enviada:', dados);

    

  }
}
