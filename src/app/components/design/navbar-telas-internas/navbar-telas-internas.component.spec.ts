import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTelasInternasComponent } from './navbar-telas-internas.component';

describe('NavbarTelasInternasComponent', () => {
  let component: NavbarTelasInternasComponent;
  let fixture: ComponentFixture<NavbarTelasInternasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarTelasInternasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarTelasInternasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
