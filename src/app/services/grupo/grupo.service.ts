import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { tap, catchError } from 'rxjs/operators';
import { Grupo, GrupoDtoPayload } from '../../models/grupo/grupo';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

   private apiUrl = 'http://localhost:8080/grupos/save';

     private gruposSource = new BehaviorSubject<Grupo[]>([]);
    grupos$ = this.gruposSource.asObservable();

  constructor(private http: HttpClient) { }

  salvarGrupoNoBackend(novoGrupo: GrupoDtoPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, novoGrupo).pipe(
      tap(() => {
        const gruposAtuais = this.gruposSource.getValue();
        // Converte o DTO recebido para o modelo completo de Grupo se necessário
        this.gruposSource.next([...gruposAtuais, novoGrupo as Grupo]); 
      }),
      catchError(error => {
        console.error('Erro ao salvar o grupo no backend:', error);
        return throwError(() => new Error('Falha ao salvar o grupo. Verifique sua conexão ou dados.'));
      })
    );
  }
}
