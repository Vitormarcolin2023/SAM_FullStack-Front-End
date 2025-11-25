import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Avaliacao } from '../../models/avaliacao/avaliacao';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  private api = environment.SERVIDOR + '/avaliacoes';
  private http = inject(HttpClient);

  saveAvaliacao(avaliacao: Avaliacao): Observable<boolean>{
    return this.http.post<boolean>(`${this.api}/projeto/${avaliacao.projeto.id}`, avaliacao);
  }

  alunoRespondeuAvaliacao(alunoId: number, projetoId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/verifica-pendencia-aluno/${alunoId}/projeto/${projetoId}`);
  }
}