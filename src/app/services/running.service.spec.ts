import { TestBed } from '@angular/core/testing';

import { RunningService } from './running.service';

describe('RunningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RunningService = TestBed.get(RunningService);
    expect(service).toBeTruthy();
  });
});
