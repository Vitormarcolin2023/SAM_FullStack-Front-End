import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CoordenacaoDetaisComponent } from '../coordenacao-principal/coordenacao-detais/coordenacao-detais.component';

describe('CoordenacaoDetaisComponent', () => {
  let component: CoordenacaoDetaisComponent;
  let fixture: ComponentFixture<CoordenacaoDetaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CoordenacaoDetaisComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordenacaoDetaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
