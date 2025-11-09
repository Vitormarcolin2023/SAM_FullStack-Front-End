import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoVisualizarMentorComponent } from './aluno-visualizar-mentor.component';

describe('AlunoVisualizarMentorComponent', () => {
  let component: AlunoVisualizarMentorComponent;
  let fixture: ComponentFixture<AlunoVisualizarMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoVisualizarMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoVisualizarMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
