import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarProjetoComponent } from './criar-projeto.component';

describe('CriarProjetosComponent', () => {
  let component: CriarProjetoComponent;
  let fixture: ComponentFixture<CriarProjetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarProjetoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
