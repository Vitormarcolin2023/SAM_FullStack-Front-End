import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso/curso';


@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private apiUrl = 'http://localhost:8080/cursos';

  constructor(private http: HttpClient) { }

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl+"/findAll");
  }
}