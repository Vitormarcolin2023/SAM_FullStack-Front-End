import { Component, Input } from '@angular/core';
import { Projeto } from '../../../models/projeto/projeto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projeto-detalhes',
  imports: [CommonModule],
  templateUrl: './projeto-detalhes.component.html',
  styleUrl: './projeto-detalhes.component.scss'
})
export class ProjetoDetalhesComponent {
  @Input() projeto!: Projeto;
}
