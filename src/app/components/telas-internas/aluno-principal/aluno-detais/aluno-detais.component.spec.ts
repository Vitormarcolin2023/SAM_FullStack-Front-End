import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoDetaisComponent } from './aluno-detais.component';

describe('AlunoDetaisComponent', () => {
  let component: AlunoDetaisComponent;
  let fixture: ComponentFixture<AlunoDetaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoDetaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoDetaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
