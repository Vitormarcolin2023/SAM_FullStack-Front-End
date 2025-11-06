import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposArquivadosDetaislsComponent } from './grupos-arquivados-detaisls.component';

describe('GruposArquivadosDetaislsComponent', () => {
  let component: GruposArquivadosDetaislsComponent;
  let fixture: ComponentFixture<GruposArquivadosDetaislsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposArquivadosDetaislsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposArquivadosDetaislsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
