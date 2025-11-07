import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Mentor } from '../../../../models/mentor/mentor';
import { AreaDeAtuacao } from '../../../../models/areadeatuacao/areadeatuacao';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-mentor-modal',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule],
  templateUrl: './mentor-modal.component.html',
  styleUrl: './mentor-modal.component.scss'
})
export class MentorModalComponent implements OnInit {

  mentores: Mentor[] = [];
  areaDoAluno: AreaDeAtuacao | null = null;
  areasDisponiveis: AreaDeAtuacao[] = [];
  areaSelecionada: AreaDeAtuacao | null = null;
  mentoresFiltrados: Mentor[] = [];

 
  constructor(public modalRef: MdbModalRef<MentorModalComponent>) {}

  ngOnInit(): void {}

  setData(data: {
    mentores: Mentor[];
    areaDoAluno: AreaDeAtuacao;
    areasDisponiveis: AreaDeAtuacao[];
  }):void {
    this.mentores = data.mentores;
    this.areaDoAluno = data.areaDoAluno;
    this.areasDisponiveis = data.areasDisponiveis;
    this.areaSelecionada = this.areaDoAluno;
    this.filtrarMentores();
  }

  filtrarMentores(): void {
    if (!this.areaSelecionada){
      this.mentoresFiltrados = [];
      return;
    }
    this.mentoresFiltrados = this.mentores.filter(
      m => m.areaDeAtuacao.id === this.areaSelecionada!.id
    );
  }
  
  selecionarMentor(mentor: Mentor): void {
    this.modalRef.close(mentor);
  }

  fecharModal(): void {
    this.modalRef.close(null);
  }
}
