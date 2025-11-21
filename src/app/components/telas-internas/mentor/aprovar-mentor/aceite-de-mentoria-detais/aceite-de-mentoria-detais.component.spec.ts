import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceiteDeMentoriaDetaisComponent } from './aceite-de-mentoria-detais.component';

describe('AceiteDeMentoriaDetaisComponent', () => {
  let component: AceiteDeMentoriaDetaisComponent;
  let fixture: ComponentFixture<AceiteDeMentoriaDetaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AceiteDeMentoriaDetaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceiteDeMentoriaDetaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
