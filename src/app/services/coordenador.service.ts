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
    return this.http.put(this.apiUrl+"/ativarMentor/"+mentorId, body, {responseType: 'text' as 'json'});
  }

inativarMentor(mentorId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/inativarMentor/${mentorId}`, {}, {responseType: 'text' as 'json'});
}

  save(coordenador: any): Observable<any> {
    console.log(coordenador);
    return this.http.post<any>(this.apiUrl+"/save", coordenador);
  }

  getCoordenadorPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar-por-email?email=${email}`);
  }

update(coordenador: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + "/update/" + coordenador.id, coordenador, {responseType: 'text' as 'json'});
}
}
