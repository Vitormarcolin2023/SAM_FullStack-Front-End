import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso/curso';


@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private apiUrl = 'http://localhost:8080/cursos'; // Ajuste a URL do seu endpoint de cursos

  constructor(private http: HttpClient) { }

  /**
   * Busca a lista de cursos no banco de dados.
   * @returns Um Observable com um array de objetos Curso.
   */
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl+"/findAll");
  }
}