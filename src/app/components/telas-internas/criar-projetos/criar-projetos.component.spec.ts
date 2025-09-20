import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarProjetosComponent } from './criar-projetos.component';

describe('CriarProjetosComponent', () => {
  let component: CriarProjetosComponent;
  let fixture: ComponentFixture<CriarProjetosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarProjetosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarProjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
