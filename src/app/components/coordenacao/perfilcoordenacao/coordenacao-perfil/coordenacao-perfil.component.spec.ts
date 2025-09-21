import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordenacaoPerfilComponent } from './coordenacao-perfil.component';

describe('CoordenacaoPerfilComponent', () => {
  let component: CoordenacaoPerfilComponent;
  let fixture: ComponentFixture<CoordenacaoPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordenacaoPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordenacaoPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
