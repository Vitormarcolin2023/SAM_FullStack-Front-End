import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grupo, GrupoDto } from '../../models/grupo/grupo';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  private baseUrl = 'http://localhost:8080';
  private grupoApiUrl = `${this.baseUrl}/grupos`;

  constructor(private http: HttpClient) {}

  criarGrupo(grupo: GrupoDto): Observable<string> {
    return this.http.post<string>(`${this.grupoApiUrl}/save`, grupo, {
      responseType: 'text' as 'json',
    });
  }

  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.grupoApiUrl}/findAll`);
  }

  getGrupoByAlunoId(alunoId: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.grupoApiUrl}/findByAluno/${alunoId}`);
  }

  atualizarGrupo(
    groupId: number,
    adminId: number,
    grupoData: { nome: string }
  ): Observable<string> {
    return this.http.put<string>(
      `${this.grupoApiUrl}/update/${groupId}/admin/${adminId}`,
      grupoData,
      { responseType: 'text' as 'json' }
    );
  }

  removerAlunoDiretamente(
    idGrupo: number,
    idAlunoRemover: number,
    idAdmin: number
  ): Observable<string> {
    const url = `${this.grupoApiUrl}/${idGrupo}/remover-aluno/${idAlunoRemover}/admin/${idAdmin}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  findGrupoByAlunoLogado(): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.grupoApiUrl}/por-aluno-logado`);
  }
}
