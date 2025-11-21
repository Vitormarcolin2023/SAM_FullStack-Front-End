// src/app/services/mentor/mentor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mentor } from '../../models/mentor/mentor';
import { environment } from '../../../environments/environment';
import { Projeto } from '../../models/projeto/projeto';

@Injectable({
  providedIn: 'root',
})
export class MentorService {
  private apiUrl = environment.SERVIDOR + '/mentores';

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<Mentor> {
    return this.http.get<Mentor>(`${this.apiUrl}/me`);
  }

  save(mentor: Mentor): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, mentor, {
      responseType: 'text',
    });
  }

  update(mentor: Mentor): Observable<any> {
    return this.http.put<Mentor>(`${this.apiUrl}/update/${mentor.id}`, mentor);
  }

  getMentorById(id: number): Observable<Mentor> {
    return this.http.get<Mentor>(`${this.apiUrl}/findById/${id}`);
  }

  listAll(): Observable<Mentor[]> {
    return this.http.get<Mentor[]>(this.apiUrl + '/findAll');
  }

  desvincularProjetos(mentorId: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/mentor/${mentorId}/desvincular-projetos`,
      null
    );
  }

  delete(mentorId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${mentorId}`, {
      responseType: 'text',
    });
  }

  findByAreaDeAtuacao(idArea: number): Observable<Mentor[]> {
    return this.http.get<Mentor[]>(`${this.apiUrl}/area/${idArea}`);
  }
}
