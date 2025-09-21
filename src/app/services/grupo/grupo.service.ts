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

  /**
   * Envia uma requisição POST para a API para criar um novo grupo.
   */
  criarGrupo(grupo: GrupoDto): Observable<string> {
    return this.http.post<string>(`${this.grupoApiUrl}/save`, grupo, {
      responseType: 'text' as 'json',
    });
  }

  /**
   * Obtém a lista de todos os grupos.
   */
  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.grupoApiUrl}/findAll`);
  }

  /**
   * ✅ NOVO: Recupera o grupo do aluno logado.
   */
  getGrupoByAlunoId(alunoId: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.grupoApiUrl}/findByAluno/${alunoId}`);
  }

  /**
   * ✅ NOVO: Atualiza informações do grupo (Admin).
   */
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

  /**
   * ✅ NOVO: Solicita a exclusão de um aluno do grupo (Admin).
   */
  excluirAluno(adminId: number, alunoId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.grupoApiUrl}/deleteAlunoById/admin/${adminId}/aluno/${alunoId}`,
      { responseType: 'text' as 'json' }
    );
  }
}
