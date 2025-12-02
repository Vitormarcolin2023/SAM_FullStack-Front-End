import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Aluno } from '../../models/aluno/aluno';
import { tick } from '@angular/core/testing';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private apiUrl = environment.SERVIDOR + '/alunos';

  private alunoLogadoSubject = new BehaviorSubject<Aluno | null>(null);
  public alunoLogado$ = this.alunoLogadoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarAlunoDaSessao();
  }

  getAlunoLogadoId(): number | null {
    return this.alunoLogadoSubject.value?.id || null;
  }

  autenticarAluno(email: string): Observable<Aluno> {
    localStorage.setItem('aluno_email', email);
    return this.getAlunoPorEmail(email).pipe(
      tap(aluno => {
        this.alunoLogadoSubject.next(aluno);
      })
    );
  }

  private carregarAlunoDaSessao(): void {
    const email = localStorage.getItem('aluno_email'); 
    if (email) {
      this.getAlunoPorEmail(email).subscribe({
        next: (aluno) => {
          this.alunoLogadoSubject.next(aluno);
        },
        error: () => this.logout(),
      });
    }
  }

  logout(): void {
    localStorage.removeItem('aluno_email');
    this.alunoLogadoSubject.next(null);
  }

  getAlunoPorEmail(email: string): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/findByEmail`, {
      params: { email },
    });
  }

  getMyProfile(): Observable<Aluno>{
    return this.http.get<Aluno>(`${this.apiUrl}/me`);
  }

  findById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/findById/${id}`);
  }

  update(id: number, payload: any): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/update/${id}`, payload);
  }

  findAlunosByCurso(id: number): Observable<Aluno[]>{
    return this.http.get<Aluno[]>(`${this.apiUrl}/findByCurso/${id}`);
  }
}