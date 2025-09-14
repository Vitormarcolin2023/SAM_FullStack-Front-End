import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelasInternasComponent } from './telas-internas.component';

describe('TelasInternasComponent', () => {
  let component: TelasInternasComponent;
  let fixture: ComponentFixture<TelasInternasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelasInternasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelasInternasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
