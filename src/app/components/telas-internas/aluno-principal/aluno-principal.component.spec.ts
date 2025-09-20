import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoPrincipalComponent } from './aluno-principal.component';

describe('AlunoPrincipalComponent', () => {
  let component: AlunoPrincipalComponent;
  let fixture: ComponentFixture<AlunoPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
