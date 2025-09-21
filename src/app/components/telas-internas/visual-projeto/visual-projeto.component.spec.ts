import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualProjetoComponent } from './visual-projeto.component';

describe('VisualProjetoComponent', () => {
  let component: VisualProjetoComponent;
  let fixture: ComponentFixture<VisualProjetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualProjetoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
