import { Component, OnInit } from '@angular/core';
import { AssessmentStateService } from './services/assessment-state/assessment-state.service';
import { AssessmentsService } from '../../services/assessments/assessments.service';
import { QuestionOption } from '../../services/assessments/assessments';
import { LoadingController, NavController } from '@ionic/angular';
import { CameraService } from '../../services/camera/camera.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { NEVER, of } from 'rxjs';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-take-assessment',
  templateUrl: './take-assessment.page.html',
  styleUrls: ['./take-assessment.page.scss'],
})
export class TakeAssessmentPage implements OnInit {

  /**
   * Custom update actions to be considered when returning to page using useExisting query parameter.
   */
  public updateActions: any = {};

  /**
   * State pointing loading of necessary items from service
   */
  public loading = true;

  constructor(
    public state: AssessmentStateService,
    public assessmentService: AssessmentsService,
    public loadingCtrl: LoadingController,
    public cameraService: CameraService,
    public toastService: ToastService,
    public router: ActivatedRoute,
    public navCtrl: NavController
  ) {
  }

  async ngOnInit() {
    const queryParams = this.router.snapshot.queryParams;

    if (!queryParams.hasOwnProperty('useExisting')) {
      this.state.reset();
      this.assessmentService.assessmentQuestions()
        .subscribe((result) => {
          this.loading = false;
          this.state.setQuestions(result.questions);
          this.state.setVersion(result.version);
        }, () => this.toastService.flash('Something went wrong'));
    } else {
      const data = JSON.parse(queryParams.useExisting);
      this.updateActions = data;

      if (data.useRecentPhoto) {
        this.useRecentPhoto();
      }

      if (data.hasOwnProperty('jumpToStep')) {
        this.state.jumpTo(parseFloat(data.jumpToStep));
      }

      this.loading = false;
    }

  }

  /**
   * Update question and move to next step
   * @param selectedOption
   */
  public async updateQuestionOption(selectedOption: QuestionOption) {
    const question = this.state.question;
    question.options = question.options.map(option => {
      option.is_selected = option === selectedOption;
      return option;
    });

    this.state.updateQuestion(question, this.state.currentStep - 1);

    if (this.updateActions.backToSummary) {
      this.state.jumpTo(this.state.totalStep);
      this.updateActions = {};
      this.navCtrl.navigateRoot('/take-assessment/summary', {
        animated: true,
        animationDirection: 'forward'
      });
    } else {
      this.state.nextStep();
    }
  }

  /**
   * Use recent photo
   */
  public async useRecentPhoto() {

    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });
    await loader.present();

    this.cameraService.latestImage()
      .pipe(finalize(() => loader.dismiss()))
      .pipe(catchError(() => {
        this.toastService.flash('Something went wrong');
        return NEVER;
      }))
      .pipe(switchMap(camera => {
        if (!camera) {
          this.takeNewPhoto();
          loader.dismiss();
          return NEVER;
        }
        return of(camera);
      }))
      .subscribe(camera => {
        this.state.setPhoto(camera);
        this.state.nextStep();
      });
  }

  /**
   * Redirect to page to take new photo
   */
  public takeNewPhoto() {
    const data = {
      useRecentPhoto: true
    };

    const redirectBackUrl = encodeURIComponent(`/take-assessment?useExisting=${JSON.stringify(data)}`);
    this.navCtrl.navigateRoot(`/camera?hideExtraFields=true&returnOnComplete=${redirectBackUrl}`);
  }
}
