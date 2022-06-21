import { Injectable } from '@angular/core';
import { AssessmentQuestion } from '../../../../services/assessments/assessments';
import * as _ from 'lodash';
import { CameraPhotos } from '../../../../services/camera/camera.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentStateService {

  /**
   * Version of questions structure
   */
  public questionVersion: number | null = null;

  /**
   * All questions
   */
  public questions: AssessmentQuestion[] = [];

  /**
   * Current Step
   */
  public currentStep = 1;

  /**
   * Total steps
   */
  public totalStep = 0;

  /**
   * Step at which camera actions will be taken
   */
  public cameraStep = 0;

  /**
   * Photo information
   */
  public photo: CameraPhotos | null = null;

  constructor() {
  }

  /**
   * Overwrites all questions
   * @param questions
   */
  public setQuestions(questions: AssessmentQuestion[]) {
    this.questions = this.orderedQuestions(questions);
    this.syncTotalSteps();
  }

  /**
   * Set the version of question structure
   * @param version
   */
  public setVersion(version: number) {
    this.questionVersion = version;
  }

  /**
   * Syncs the information
   */
  public syncTotalSteps() {
    this.totalStep = this.questions.length + 1;
    this.cameraStep = this.questions.length + 1;
  }

  /**
   * Updates the question information at index
   *
   * @param question
   * @param index
   */
  public updateQuestion(question: AssessmentQuestion, index: number) {
    this.questions[index] = question;
    this.questions = this.orderedQuestions(this.questions);
  }

  /**
   * Returns the question respect to current step
   */
  public get question(): AssessmentQuestion {
    if (this.currentStep > this.questions.length) {
      throw new Error('Current Step does contain the question');
    }

    return this.questions[this.currentStep - 1];
  }

  /**
   * Move to next step
   */
  public nextStep() {
    if (this.currentStep < this.totalStep) {
      this.currentStep += 1;
    }
  }

  /**
   * Move to previous step
   */
  public previousStep() {
    if (this.currentStep > 0) {
      this.currentStep -= 1;
    }
  }

  /**
   * Directly jump to step
   * @param step
   */
  public jumpTo(step: number) {
    if (step < 0 || step > this.totalStep) {
      throw new Error('Step provided not in bound');
    }

    this.currentStep = step;
  }

  /**
   * Returns ordered questions with internal options ordered as well
   * @param questions
   */
  public orderedQuestions(questions: AssessmentQuestion[]): AssessmentQuestion[] {
    const orderedQuestions = _.orderBy(questions, ['order'], ['asc']);
    return orderedQuestions.map(q => {
      q.options = _.orderBy(q.options, ['order'], ['asc']);
      return q;
    });
  }

  /**
   * Returns true if current step is camera step
   */
  public isCameraStep(): boolean {
    return this.currentStep === this.cameraStep;
  }

  /**
   * Returns true if current step is camera step
   */
  public isNextStepCameraStep(): boolean {
    return (this.currentStep + 1) === this.cameraStep;
  }

  /**
   * Reset the state
   */
  public reset() {
    this.questions = [];
    this.currentStep = 1;
    this.totalStep = 0;
    this.cameraStep = 0;
    this.photo = null;
  }

  /**
   * Sets the camera shot
   * @param photo
   */
  public setPhoto(photo: CameraPhotos) {
    this.photo = photo;
  }
}
