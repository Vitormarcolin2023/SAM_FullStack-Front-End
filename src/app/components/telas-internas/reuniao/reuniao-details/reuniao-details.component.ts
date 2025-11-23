import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reuniao } from '../../../../models/reuniao/reuniao';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reuniao-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reuniao-details.component.html',
  styleUrls: ['./reuniao-details.component.scss'],
})
export class ReuniaoDetailsComponent {
  @Input() reuniaoSelecionada: Reuniao | null = null;
  @Input() role!: string;
  @Input() isLoading: boolean = false;

  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<Reuniao>();


  editar: boolean = false;
  private reuniaoOriginal!: Reuniao;

  dataInvalida: boolean = false;

  get podeEditar(): boolean {
    return (
      !!this.reuniaoSelecionada &&
      this.reuniaoSelecionada.statusReuniao === 'PENDENTE' &&
      this.reuniaoSelecionada.solicitadoPor !== this.role
    );
  }

  habilitarEdicao() {
    if (this.podeEditar && this.reuniaoSelecionada) {
      this.editar = true;
      this.reuniaoOriginal = { ...this.reuniaoSelecionada };
    }
  }

  salvarEdicao() {
    if (!this.reuniaoSelecionada) return;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataSelecionada = new Date(this.reuniaoSelecionada.data);

    if (dataSelecionada < hoje) {
      this.dataInvalida = true;
      return;
    }

    this.dataInvalida = false;

    this.salvar.emit(this.reuniaoSelecionada);
    this.editar = false;
  }

  cancelarEdicao() {
    this.editar = false;

    if (this.reuniaoSelecionada && this.reuniaoOriginal) {
      Object.assign(this.reuniaoSelecionada, this.reuniaoOriginal);
    }
  }

  fecharModal() {
    this.fechar.emit();
  }

  voltar() {
    this.cancelarEdicao();
    this.fechar.emit();
  }
}
