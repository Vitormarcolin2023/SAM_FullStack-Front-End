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
    const body = { statusMentor: 'ATIVO' }; 
    return this.http.put(this.apiUrl+"/ativarMentor/"+mentorId, body);
  }

  desativarMentor(mentorId: number | undefined): Observable<any> {
    const body = {statusMentor: 'INATIVO'};
    return this.http.put(this.apiUrl+"/desativarMentor/"+mentorId, body);
  }

  save(coordenador: any): Observable<any> {
    console.log(coordenador);
    return this.http.post<any>(this.apiUrl+"/save", coordenador);
  }
}
