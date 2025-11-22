import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuniaoDetailsComponent } from './reuniao-details.component';

describe('ReuniaoDetailsComponent', () => {
  let component: ReuniaoDetailsComponent;
  let fixture: ComponentFixture<ReuniaoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuniaoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuniaoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
