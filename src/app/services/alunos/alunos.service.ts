import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Aluno } from '../../models/aluno/aluno';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private apiUrl = 'http://localhost:8080/alunos';

  private alunoLogadoSubject = new BehaviorSubject<Aluno | null>(null);
  public alunoLogado$ = this.alunoLogadoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarAlunoDaSessao();
  }

  // AQUI COMEÇOU A ALTERAÇÃO
  /**
   * Método principal a ser chamado após o login.
   * Recebe o e-mail, salva no localStorage, busca o Aluno completo
   * e atualiza o estado da aplicação (BehaviorSubject).
   * Retorna um Observable para que o chamador saiba quando o processo terminou.
   */
  autenticarAluno(email: string): Observable<Aluno> {
    localStorage.setItem('aluno_email', email); // Chave padronizada
    return this.getAlunoPorEmail(email).pipe(
      tap(aluno => {
        this.alunoLogadoSubject.next(aluno);
      })
    );
  }
  // AQUI FINALIZOU A ALTERAÇÃO

  private carregarAlunoDaSessao(): void {
    // AQUI COMEÇOU A ALTERAÇÃO
    const email = localStorage.getItem('aluno_email'); // Usando a chave padronizada
    // AQUI FINALIZOU A ALTERAÇÃO
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
    // AQUI COMEÇOU A ALTERAÇÃO
    localStorage.removeItem('aluno_email'); // Usando a chave padronizada
    // AQUI FINALIZOU A ALTERAÇÃO
    this.alunoLogadoSubject.next(null);
  }

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