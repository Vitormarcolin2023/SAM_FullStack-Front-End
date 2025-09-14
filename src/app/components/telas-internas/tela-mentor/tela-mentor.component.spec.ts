import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaMentorComponent } from './tela-mentor.component';

describe('TelaMentorComponent', () => {
  let component: TelaMentorComponent;
  let fixture: ComponentFixture<TelaMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
