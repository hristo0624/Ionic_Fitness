import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { Transphormer } from '../../../services/authentication/authentication.service';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import { ErrorsService } from '../../../services/errors/errors.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { TrainingHomeWorkouts, TrainingLevels, TrainingProgramTypes } from '../../../services/onboarding/onboarding.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';

interface TrainerTransphormerDetail extends Transphormer {
  thirty_day_completed_workouts: number;
  seven_day_completed_workouts: number;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public transphormer: TrainerTransphormerDetail;
  protected transphormerId: number;

  constructor(
    public navCtrl: NavController,
    private loaderCtrl: LoadingController,
    private toastSvc: ToastService,
    private trainerTransphormerService: TrainerTransphormerService,
    public errorService: ErrorsService,
    private router: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.transphormerId = parseFloat(this.router.snapshot.paramMap.get('id'));
    this.getTransphormerDetails();
  }

  private async getTransphormerDetails() {
    const loader = await this.loaderCtrl.create({
      message: 'Please wait',
    });
    await loader.present();

    try {
      this.transphormer = <TrainerTransphormerDetail>(
        await this.trainerTransphormerService.transphormer(this.transphormerId)
      );
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public get dob(): string {
    return moment(this.transphormer.dob).format('M/d/YY');
  }

  public get weightLastUpdatedOn(): string {

    if (!this.transphormer) {
      return '';
    }

    if (this.transphormer.latest_weight === null) {
      return 'Never';
    }

    const currentTimeUtc = moment.utc();
    const lastUpdateUtc = moment.utc(this.transphormer.latest_weight.logged_on);

    if (Math.abs(currentTimeUtc.diff(lastUpdateUtc, 'hours')) < 24) {
      return `${Math.abs(currentTimeUtc.diff(lastUpdateUtc, 'hours'))} Hours`;
    } else {
      return `${Math.abs(currentTimeUtc.diff(lastUpdateUtc, 'days'))} Days`;
    }
  }

  public goToPhotos() {
    this.navCtrl.navigateForward(`photos/${this.transphormer.id}`);
  }

  public goToNutritionDetails() {
    this.navCtrl.navigateForward(`my-transphormers/${this.transphormer.id}/nutrition-detail`);
  }

  public goToTransphormersDetails() {
    this.navCtrl.navigateForward(`my-transphormers/${this.transphormer.id}/transphormer-workout`);
  }

  public goToMetrics() {
    this.navCtrl.navigateForward(`metrics/${this.transphormer.id}`);
  }

  public goToAssessments() {
    this.navCtrl.navigateForward(`my-transphormers/${this.transphormer.id}/assessments`);
  }

  public get trainingLevelName() {
    const option = TrainingLevels.find((i) => {
      return i.value === this.transphormer.training_level;
    });
    if (!option) {
      return 'error';
    }
    return option.name;
  }

  public get homeWorkoutName(): string {
    const option = TrainingHomeWorkouts.find((i) => {
      return i.value === this.transphormer.home_workout_selection;
    });
    if (!option) {
      return 'error';
    }
    return option.name;
  }

  public get gymWorkoutName(): string {
    const option = TrainingProgramTypes.find((i) => {
      return i.value === this.transphormer.gym_workout_selection;
    });
    if (!option) {
      return 'error';
    }
    return option.name || '';
  }

  public get transphormerSinceDate(): string {
    if (!this.transphormer) {
      return '';
    }
    return moment.utc(this.transphormer.created_at).format('MMM YYYY');
  }

  public goToMessages() {
    this.navCtrl.navigateForward(`chat-messages/${this.transphormerId}`);
  }

  public get bottomBodyChange() {
    if (this.transphormer.transphormation_goal === 'Primarily lose bodyfat') {
      return 'Bodyfat';
    }
    if (this.transphormer.transphormation_goal === 'Gain lean muscle') {
      return 'Muscle';
    }
  }
}
