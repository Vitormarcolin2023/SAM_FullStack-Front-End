import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Avaliacao } from '../../models/avaliacao/avaliacao';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
/*
  private avaliacaoPendenteSubject = new BehaviorSubject<boolean>(true); 
  public avaliacaoPendente$: Observable<boolean> = this.avaliacaoPendenteSubject.asObservable();

  public marcarComoConcluida(): void {
    this.avaliacaoPendenteSubject.next(false);
    // **OPCIONAL:** localStorage.setItem('mentoriaAvaliacaoConcluida', 'true');
    console.log('Avaliação concluída. Sistema desbloqueado.');
  }

  
  public isPendente(): boolean {
    return this.avaliacaoPendenteSubject.getValue();
  }
  */

  private api = 'http://localhost:8080/avaliacoes';
  private http = inject(HttpClient);

  saveAvaliacao(avaliacao: Avaliacao): Observable<Avaliacao>{
    return this.http.post<Avaliacao>(`${this.api}/projeto/${avaliacao.projeto.id}`, avaliacao);
  }

  alunoRespondeuAvaliacao(alunoId: number, projetoId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/verifica-pendencia-aluno/${alunoId}/projeto/${projetoId}`);
  }
}