import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarprojetosComponent } from './visualizarprojetos.component';

describe('VisualizarprojetosComponent', () => {
  let component: VisualizarprojetosComponent;
  let fixture: ComponentFixture<VisualizarprojetosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarprojetosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarprojetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
