import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

 private _coordenadorLogado: any;

  constructor() {
    const storedCoordenador = localStorage.getItem('coordenadorLogado');
    if (storedCoordenador) {
      this._coordenadorLogado = JSON.parse(storedCoordenador);
    }
  }

  setCoordenador(coordenador: any) {
    this._coordenadorLogado = coordenador;
  }

  getCoordenador() {
    return this._coordenadorLogado;
  }

  clearCoordenador() {
    this._coordenadorLogado = null;
    localStorage.removeItem('coordenadorLogado');
  }
}
