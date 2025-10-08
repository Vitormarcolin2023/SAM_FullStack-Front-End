import { TestBed } from '@angular/core/testing';

import { SelecaoService } from './selecao.service';

describe('SelecaoService', () => {
  let service: SelecaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelecaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
