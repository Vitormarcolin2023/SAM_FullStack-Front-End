import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordenacaoDetaisComponent } from './coordenacao-detais.component';

describe('CoordenacaoDetaisComponent', () => {
  let component: CoordenacaoDetaisComponent;
  let fixture: ComponentFixture<CoordenacaoDetaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordenacaoDetaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordenacaoDetaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
