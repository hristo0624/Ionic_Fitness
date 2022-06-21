import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-counter',
  templateUrl: './step-counter.component.html',
  styleUrls: ['./step-counter.component.scss'],
})
export class StepCounterComponent {

  /**
   * Total steps
   */
  @Input()
  public totalSteps = 0;

  /**
   * Current step
   */
  @Input()
  public currentStep = 0;

  /**
   * Use in mini mode
   */
  @Input()
  public miniMode = false;

  constructor() {
  }

  /**
   * Getter for returning total steps as an array calculated based on totalSteps
   */
  public get steps(): number[] {
    const steps = [];
    for (let i = 1; i <= this.totalSteps; i++) {
      steps.push(i);
    }

    return steps;
  }

}
