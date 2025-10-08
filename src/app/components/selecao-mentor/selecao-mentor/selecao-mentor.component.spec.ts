import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoMentorComponent } from './selecao-mentor.component';

describe('SelecaoMentorComponent', () => {
  let component: SelecaoMentorComponent;
  let fixture: ComponentFixture<SelecaoMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecaoMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecaoMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
