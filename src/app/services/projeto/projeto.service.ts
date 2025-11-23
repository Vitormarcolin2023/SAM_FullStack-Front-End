import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Projeto } from '../../models/projeto/projeto';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  private API = 'http://localhost:8080/projetos';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.API}/findAll`);
}
   findById(id: number): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.API}/findById/${id}`);
   }

    buscarPorNome(nome: string): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.API}/buscar-por-nome?nome=${nome}`);
  }

  buscarPorArea(areaDeAtuacaoId: number): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.API}/buscar-por-atuacao?areaDeAtuacao=${areaDeAtuacaoId}`);
  }

  buscarPorPeriodo(periodo: string): Observable<Projeto[]> {
  return this.http.get<Projeto[]>(`${this.API}/buscar-por-periodo`, {
    params: { periodo } 
  });
}

  save(projeto: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(`${this.API}/save`, projeto);
    
}

update(id: number, projeto: Projeto): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.API}/update/${id}`, projeto);
  }

   delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/delete/${id}`);
  }

  findByMentor(id: number): Observable<Projeto[]>{
    return this.http.get<Projeto[]>(`${this.API}/mentor/${id}`);
  }

  buscarPorProfessor(professorId: number): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.API}/professor/${professorId}`);
  }

  buscarProjetoAtivo(alunoId: number): Observable<Projeto>{
    return this.http.get<Projeto>(`${this.API}/buscar-projeto-ativo/${alunoId}`);
  }

  buscarProjetosAtivos(mentorId: number): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.API}/buscar-projetos-ativos-mentor/${mentorId}`);
  }

  buscarProjetosAguardandoAvaliacaoMentor(mentorId: number): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.API}/buscar-projetos-nao-avaliados-mentor/${mentorId}`);
  }

  buscarProjetoAguardandoAvaliacaoAluno(alunoId: number): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.API}/buscar-projeto-nao-avaliado-aluno/${alunoId}`);
  }
}