import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaDeAtuacao } from '../../models/mentor/mentor';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AreaDeAtuacaoService {
  private apiUrl = environment.SERVIDOR + '/areas';

  constructor(private http: HttpClient) {}

  findAll(): Observable<AreaDeAtuacao[]> {
    return this.http.get<AreaDeAtuacao[]>(`${this.apiUrl}/findAll`);
  }

  findAreaDeAtuacaoByAlunoLogado(): Observable<AreaDeAtuacao> {
    return this.http.get<AreaDeAtuacao>(`${this.apiUrl}/por-aluno-logado`);
  }
}
