import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GrupoDto } from '../../models/grupo/grupo';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  
  private baseUrl = 'http://localhost:8080';
  private grupoApiUrl = `${this.baseUrl}/grupos`;
  
  constructor(private http: HttpClient) { }

  /**
   * Envia uma requisição POST para a API para criar um novo grupo.
   * A rota do back-end é /grupos/save
   * @param grupo O objeto GrupoDTO contendo os dados do novo grupo.
   * @returns Um Observable com o resultado da requisição.
   */
  criarGrupo(grupo: GrupoDto): Observable<string> {
    return this.http.post<string>(`${this.grupoApiUrl}/save`, grupo);
  }

  /**
   * Obtém a lista de todos os grupos.
   * A rota do back-end é /grupos/findAll
   */
  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.grupoApiUrl}/findAll`);
  }
}