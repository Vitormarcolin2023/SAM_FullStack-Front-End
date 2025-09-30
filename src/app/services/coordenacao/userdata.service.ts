import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  private _coordenadorLogado: any;
  private _professorLogado: any;

  constructor() {
    const storedCoordenador = localStorage.getItem('coordenadorLogado');
    if (storedCoordenador) {
      this._coordenadorLogado = JSON.parse(storedCoordenador);
    }

    const storedProfessor = localStorage.getItem('professorLogado');
    if (storedProfessor) {
      this._professorLogado = JSON.parse(storedProfessor);
    }
  }

  setCoordenador(coordenador: any) {
    this._coordenadorLogado = coordenador;
    localStorage.setItem('coordenadorLogado', JSON.stringify(coordenador));
  }

  getCoordenador() {
    return this._coordenadorLogado;
  }

  clearCoordenador() {
    this._coordenadorLogado = null;
    localStorage.removeItem('coordenadorLogado');
  }

  setProfessor(professor: any) {
    this._professorLogado = professor;
    localStorage.setItem('professorLogado', JSON.stringify(professor));
  }

  getProfessor() {
    return this._professorLogado;
  }

  clearProfessor() {
    this._professorLogado = null;
    localStorage.removeItem('professorLogado');
  }
}