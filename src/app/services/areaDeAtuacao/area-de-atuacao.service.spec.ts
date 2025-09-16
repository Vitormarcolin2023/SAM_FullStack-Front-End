import { TestBed } from '@angular/core/testing';

import { AreaDeAtuacaoService } from './area-de-atuacao.service';

describe('AreaDeAtuacaoService', () => {
  let service: AreaDeAtuacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaDeAtuacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
