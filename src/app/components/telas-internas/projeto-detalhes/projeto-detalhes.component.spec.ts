import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoDetalhesComponent } from './projeto-detalhes.component';

describe('ProjetoDetalhesComponent', () => {
  let component: ProjetoDetalhesComponent;
  let fixture: ComponentFixture<ProjetoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
