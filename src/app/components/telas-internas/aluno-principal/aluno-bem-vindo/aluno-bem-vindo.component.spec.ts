import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoBemVindoComponent } from './aluno-bem-vindo.component';

describe('AlunoBemVindoComponent', () => {
  let component: AlunoBemVindoComponent;
  let fixture: ComponentFixture<AlunoBemVindoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoBemVindoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoBemVindoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
