import { Injectable, inject, ɵUSE_RUNTIME_DEPS_TRACKER_FOR_JIT } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor } from '../../models/professor/professor';
import { Curso } from '../../models/curso/curso';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private http = inject(HttpClient);
  private readonly API = environment.SERVIDOR + '/api/professor'; 

  constructor() {}

  save(professorData: Professor): Observable<string> {
    return this.http.post(this.API+"/save", professorData, { responseType: 'text' });
  }

  update(professorData: Professor): Observable<string> {
    const url = `${this.API}/update/${professorData.id}`;
    return this.http.put(url, professorData, { responseType: 'text' });
  }

  getProfessorPorEmail(email: string): Observable<Professor | null> {
    const url = `${this.API}/buscar-por-email?email=${email}`;
    return this.http.get<Professor>(url);
  }

  delete(id: number): Observable<string> {
    const url = `${this.API}/delete/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  findAll(): Observable<Professor[]> {
    const url = `${this.API}/findAll`;
    return this.http.get<Professor[]>(url);
  }

  getProfessorPorId(id: number): Observable<Professor> {
      const url = `${this.API}/getById/${id}`;
      return this.http.get<Professor>(url);
  }

  getMyProfile(): Observable<Professor> {
    const url = `${this.API}/me`;
    return this.http.get<Professor>(url);
  }
}