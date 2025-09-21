import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorEditComponent } from './mentor-edit.component';

describe('MentorEditComponent', () => {
  let component: MentorEditComponent;
  let fixture: ComponentFixture<MentorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
