import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposArquivadosComponent } from './grupos-arquivados.component';

describe('GruposArquivadosComponent', () => {
  let component: GruposArquivadosComponent;
  let fixture: ComponentFixture<GruposArquivadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposArquivadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposArquivadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
