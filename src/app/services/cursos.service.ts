import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso/curso';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CursosService {

private apiUrl = environment.SERVIDOR + '/cursos';

  constructor(private http: HttpClient) { }

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl+"/findAll");
  }
}