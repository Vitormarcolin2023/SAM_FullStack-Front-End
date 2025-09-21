import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetosMentorComponent } from './projetos-mentor.component';

describe('ProjetosMentorComponent', () => {
  let component: ProjetosMentorComponent;
  let fixture: ComponentFixture<ProjetosMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetosMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetosMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
