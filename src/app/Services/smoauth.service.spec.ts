import { TestBed } from '@angular/core/testing';

import { SmoauthService } from './smoauth.service';

describe('SmoauthService', () => {
  let service: SmoauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmoauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
