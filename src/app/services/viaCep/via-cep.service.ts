import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private apiUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) { }

  buscar(cep: string): Observable<ViaCepResponse> {
    const cepFormatado = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`${this.apiUrl}/${cepFormatado}/json/`);
  }
}
