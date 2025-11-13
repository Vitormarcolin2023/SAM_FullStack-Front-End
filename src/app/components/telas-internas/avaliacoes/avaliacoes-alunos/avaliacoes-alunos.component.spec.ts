import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacoesAlunosComponent } from './avaliacoes-alunos.component';

describe('AvaliacoesAlunosComponent', () => {
  let component: AvaliacoesAlunosComponent;
  let fixture: ComponentFixture<AvaliacoesAlunosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacoesAlunosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliacoesAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
