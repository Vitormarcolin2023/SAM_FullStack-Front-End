import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reuniao, ReuniaoDto } from '../../models/reuniao/reuniao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReuniaoService {

  private API = 'http://localhost:8080/reunioes';

  constructor(private http: HttpClient) { }

  salvarReuniao(reuniaoDTO: ReuniaoDto): Observable<string> {
    return this.http.post<string>(`${this.API}/save`, reuniaoDTO,  { responseType: 'text' as 'json' });
  }
  
  buscarReunioesPorProjeto(projetoId: number): Observable<Reuniao[]>{
    return this.http.get<Reuniao[]>(`${this.API}/findByProjeto/${projetoId}`);
  }

  updateReuniao(reuniaoId: number, reuniaoAtualizada: Reuniao): Observable<string> {
    return this.http.put<string>(`${this.API}/update/${reuniaoId}`, reuniaoAtualizada, { responseType: 'text' as 'json'});
  }

  aceitarReuniao(reuniaoId: number, statusReuniao: string, motivoRecusa: string): Observable<string>{
    return this.http.put<string>(`${this.API}/confirmarReuniao/${reuniaoId}/status/${statusReuniao}/motivo-cancelamento${motivoRecusa}`, null, {responseType: 'text' as 'json'});
  }
}
