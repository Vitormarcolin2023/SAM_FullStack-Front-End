import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReuniaoDto } from '../../models/reuniao/reuniao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReuniaoService {

  private API = 'http://localhost:8080/reunioes';

  constructor(private http: HttpClient) { }

  salvarReuniao(reuniaoDTO: ReuniaoDto): Observable<string> {
    return this.http.post<string>(`${this.API}/save`, reuniaoDTO,  { responseType: 'text' as 'json' });
  }
}
