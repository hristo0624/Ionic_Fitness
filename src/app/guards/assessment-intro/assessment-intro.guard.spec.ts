import { TestBed, async, inject } from '@angular/core/testing';

import { AssessmentIntroGuard } from './assessment-intro.guard';

describe('AssessmentIntroGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentIntroGuard]
    });
  });

  it('should ...', inject([AssessmentIntroGuard], (guard: AssessmentIntroGuard) => {
    expect(guard).toBeTruthy();
  }));
});
