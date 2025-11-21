import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorPrincipalComponent } from './professor-principal.component';

describe('ProfessorPrincipalComponent', () => {
  let component: ProfessorPrincipalComponent;
  let fixture: ComponentFixture<ProfessorPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
