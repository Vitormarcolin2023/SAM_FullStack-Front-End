import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mentor } from '../../models/mentor/mentor';

@Injectable({
  providedIn: 'root',
})
export class MentorService {
  private apiUrl = 'http://localhost:8080/mentores';

  constructor(private http: HttpClient) {}

  save(mentor: Mentor): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, mentor, {
      responseType: 'text',
    });
  }
}
