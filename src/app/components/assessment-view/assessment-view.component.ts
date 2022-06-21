import { Component, Input, OnInit } from '@angular/core';
import { Assessment } from '../../services/assessments/assessments.service';
import * as moment from 'moment';

@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit {

  @Input() assessment: Assessment;
  public nutritionOpened = true;
  public workoutsOpened = true;
  public photosOpened = true;
  public questionsOpened = true;
  public weighInsOpened = true;
  public Math = Math;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * @param date
   */
  public getFromNowFormattedDate(date: string): string {
    return moment(date).format('M/D/YY');
  }

  get sortedWeights() {
    return this.assessment.body_metrics.sort((a, b) => {
      return a.logged_on > b.logged_on ? -1 : 1;
    });
  }

  /**
   * Calculates a weight difference
   * @param currentIndex the index
   */
  public diffInWeight(currentIndex): number {
    if (currentIndex === this.assessment.body_metrics.length - 1) {
      return 0;
    } else {
      return (-1) * (this.assessment.body_metrics[currentIndex + 1].weight - this.assessment.body_metrics[currentIndex].weight);
    }
  }

  get transphormerDoingMacroCalorieCounting(): boolean {
    return this.assessment.transphormer.likely_to_do === 'Calorie / Macro counting';
  }
}

