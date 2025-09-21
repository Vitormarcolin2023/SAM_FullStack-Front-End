import { Component, Input } from '@angular/core';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projeto-detalhes',
  templateUrl: './projeto-detalhes.component.html',
  styleUrl: './projeto-detalhes.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class ProjetoDetalhesComponent {
  @Input('projeto') projeto!: Projeto;
}
