import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovarMentorComponent } from './aprovar-mentor.component';

describe('AprovarMentorComponent', () => {
  let component: AprovarMentorComponent;
  let fixture: ComponentFixture<AprovarMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovarMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprovarMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
