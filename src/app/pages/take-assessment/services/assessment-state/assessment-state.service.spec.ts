import { TestBed } from '@angular/core/testing';

import { AssessmentStateService } from './assessment-state.service';

describe('AssessStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssessmentStateService = TestBed.get(AssessmentStateService);
    expect(service).toBeTruthy();
  });
});
