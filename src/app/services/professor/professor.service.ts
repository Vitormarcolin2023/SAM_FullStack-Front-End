import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor } from '../../models/professor/professor';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/professor'; 

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

}