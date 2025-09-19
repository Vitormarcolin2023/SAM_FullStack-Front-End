import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCoordenacaoComponent } from './cadastro-coordenacao.component';

describe('CadastroCoordenacaoComponent', () => {
  let component: CadastroCoordenacaoComponent;
  let fixture: ComponentFixture<CadastroCoordenacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCoordenacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCoordenacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
