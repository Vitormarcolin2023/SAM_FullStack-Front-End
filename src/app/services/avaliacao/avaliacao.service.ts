import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
}