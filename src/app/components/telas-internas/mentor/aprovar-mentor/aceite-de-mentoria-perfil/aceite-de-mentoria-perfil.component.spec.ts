import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceiteDeMentoriaPerfilComponent } from './aceite-de-mentoria-perfil.component';

describe('AceiteDeMentoriaPerfilComponent', () => {
  let component: AceiteDeMentoriaPerfilComponent;
  let fixture: ComponentFixture<AceiteDeMentoriaPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AceiteDeMentoriaPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceiteDeMentoriaPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
