import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoDetailsComponent } from './avaliacao-details.component';

describe('AvaliacaoDetailsComponent', () => {
  let component: AvaliacaoDetailsComponent;
  let fixture: ComponentFixture<AvaliacaoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacaoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliacaoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
