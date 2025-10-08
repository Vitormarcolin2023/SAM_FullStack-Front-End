import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mentor } from '../../models/mentor/mentor';

@Injectable({
  providedIn: 'root',
})
export class SelecaoService {
  // BehaviorSubject guarda o último valor e o emite para novos inscritos
  private mentorSelecionadoSource = new BehaviorSubject<Mentor | null>(null);

  constructor() {}

  /**
   * Emite o mentor selecionado para quem estiver observando.
   */
  setMentor(mentor: Mentor): void {
    this.mentorSelecionadoSource.next(mentor);
  }

  /**
   * Retorna um Observable que os componentes podem 'escutar' para receber o mentor.
   */
  getMentorSelecionado(): Observable<Mentor | null> {
    return this.mentorSelecionadoSource.asObservable();
  }

  /**
   * Limpa o mentor selecionado para que não seja reutilizado indevidamente.
   */
  clearMentor(): void {
    this.mentorSelecionadoSource.next(null);
  }
}
