import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordenacaoPrincipalComponent } from './coordenacao-principal.component';

describe('CoordenacaoPrincipalComponent', () => {
  let component: CoordenacaoPrincipalComponent;
  let fixture: ComponentFixture<CoordenacaoPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordenacaoPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordenacaoPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
