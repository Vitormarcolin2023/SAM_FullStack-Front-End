import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPerfilComponent } from './mentor-perfil.component';

describe('MentorPerfilComponent', () => {
  let component: MentorPerfilComponent;
  let fixture: ComponentFixture<MentorPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
