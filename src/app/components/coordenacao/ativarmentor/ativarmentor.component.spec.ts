import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtivarmentorComponent } from './ativarmentor.component';

describe('AtivarmentorComponent', () => {
  let component: AtivarmentorComponent;
  let fixture: ComponentFixture<AtivarmentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtivarmentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtivarmentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
