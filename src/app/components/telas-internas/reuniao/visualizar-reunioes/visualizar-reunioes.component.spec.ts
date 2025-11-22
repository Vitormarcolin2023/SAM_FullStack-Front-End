import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarReunioesComponent } from './visualizar-reunioes.component';

describe('VisualizarReunioesComponent', () => {
  let component: VisualizarReunioesComponent;
  let fixture: ComponentFixture<VisualizarReunioesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarReunioesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarReunioesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
