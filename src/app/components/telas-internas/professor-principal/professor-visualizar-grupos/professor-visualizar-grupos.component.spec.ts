import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorVisualizarGruposComponent } from './professor-visualizar-grupos.component';

describe('ProfessorVisualizarGruposComponent', () => {
  let component: ProfessorVisualizarGruposComponent;
  let fixture: ComponentFixture<ProfessorVisualizarGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorVisualizarGruposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorVisualizarGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
