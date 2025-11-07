import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorModalComponent } from './mentor-modal.component';

describe('MentorModalComponent', () => {
  let component: MentorModalComponent;
  let fixture: ComponentFixture<MentorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
