import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCounterComponent } from './step-counter.component';

describe('StepCounterComponent', () => {
  let component: StepCounterComponent;
  let fixture: ComponentFixture<StepCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepCounterComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have full mode when no miniMode input passed', () => {
    expect(fixture.elementRef.nativeElement.querySelector('.mini-mode')).toBeFalsy('Mini mode detected');
    expect(fixture.elementRef.nativeElement.querySelector('.step-info')).toBeTruthy('Step info not found');
  });

  it('should have mini mode when miniMode set to true', () => {
    component.miniMode = true;
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('.mini-mode')).toBeTruthy('Mini mode not detected');
    expect(fixture.elementRef.nativeElement.querySelector('.step-info')).toBeFalsy('Step info found.');
  });

  it('should have 4 divs if totalStep is 4', () => {
    component.totalSteps = 4;
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelectorAll('.step').length).toEqual(4);
  });

  it('should have 4 divs active if totalStep is 6 and current step is 4', () => {
    component.totalSteps = 6;
    component.currentStep = 4;
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelectorAll('.step.active').length).toEqual(4);
  });
});
