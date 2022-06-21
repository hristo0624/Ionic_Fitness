import { TestBed, async, inject } from '@angular/core/testing';

import { AssessmentSummaryGuard } from './assessment-summary.guard';

describe('AssessmentSummaryGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentSummaryGuard]
    });
  });

  it('should ...', inject([AssessmentSummaryGuard], (guard: AssessmentSummaryGuard) => {
    expect(guard).toBeTruthy();
  }));
});
