import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoPostComponent } from './grupo-post.component';

describe('GrupoPostComponent', () => {
  let component: GrupoPostComponent;
  let fixture: ComponentFixture<GrupoPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
