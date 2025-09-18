import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordenadorService {

  constructor() { }

  http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/coordenador';


  ativarMentor(mentorId: number | undefined): Observable<any> {
    // Exemplo de uma requisição PUT para atualizar o status
    // O endpoint e o formato do body podem variar dependendo da sua API
    const body = { statusMentor: 'CONCLUIDO' }; 
    return this.http.put(this.apiUrl+"/ativarMentor/"+mentorId, body);
  }

  desativarMentor(mentorId: number | undefined): Observable<any> {
    const body = {statusMentor: 'PENDENTE'};
    return this.http.put(this.apiUrl+"/desativarMentor/"+mentorId, body);
  }
}
