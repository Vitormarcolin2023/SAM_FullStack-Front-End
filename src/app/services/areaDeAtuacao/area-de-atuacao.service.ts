import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaDeAtuacao } from '../../models/mentor/mentor';

@Injectable({
  providedIn: 'root',
})
export class AreaDeAtuacaoService {
  private apiUrl = 'http://localhost:8080/areas';

  constructor(private http: HttpClient) {}

  findAll(): Observable<AreaDeAtuacao[]> {
    return this.http.get<AreaDeAtuacao[]>(`${this.apiUrl}/findAll`);
  }

  findAreaDeAtuacaoByAlunoLogado(): Observable<AreaDeAtuacao> {
    return this.http.get<AreaDeAtuacao>(`${this.apiUrl}/por-aluno-logado`);
  }
}
