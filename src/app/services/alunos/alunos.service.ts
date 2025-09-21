import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../../models/aluno/aluno';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private apiUrl = 'http://localhost:8080/alunos';

  constructor(private http: HttpClient) {}

  getAlunoPorEmail(email: string): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/findByEmail`, {
      params: { email },
    });
  }

  findById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/findById/${id}`);
  }

  update(id: number, payload: any): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/update/${id}`, payload);
  }
}
