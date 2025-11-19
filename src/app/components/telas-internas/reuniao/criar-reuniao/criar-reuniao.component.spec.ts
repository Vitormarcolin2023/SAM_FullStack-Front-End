import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarReuniaoComponent } from './criar-reuniao.component';

describe('CriarReuniaoComponent', () => {
  let component: CriarReuniaoComponent;
  let fixture: ComponentFixture<CriarReuniaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarReuniaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarReuniaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
