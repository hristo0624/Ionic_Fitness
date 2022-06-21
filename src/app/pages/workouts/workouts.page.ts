import { WorkoutsInfoComponent } from './workouts-info/workouts-info.component';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { AlertInput } from '@ionic/core';
import { TrackerComponent } from './tracker/tracker.component';
import { AddNoteComponent } from './add-note/add-note.component';
import {
  WorkoutExercise,
  WorkoutExerciseData,
  WorkoutInfo,
  WorkoutNote,
  WorkoutSession, WorkoutSessionExercise,
  WorkoutsService,
} from '../../services/workouts/workouts.service';
import { ErrorFormat, ErrorsService } from '../../services/errors/errors.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Transphormer } from '../../services/authentication/authentication.service';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';
import { TrainingHomeWorkouts } from '../../services/onboarding/onboarding.service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
})
export class WorkoutsPage implements OnInit, CanLeaveRoute {
  public workoutSession: WorkoutSession | null | undefined = undefined;

  public actingDate: Moment;
  public today: Moment;
  public canEdit = true;
  public transphormer: Transphormer;
  public minDate: Moment;
  public canLeaveAndroidBack = true;

  constructor(
    private modal: ModalController,
    protected navCtrl: NavController,
    private workoutService: WorkoutsService,
    private loadingCtrl: LoadingController,
    public errorService: ErrorsService,
    private toastSvc: ToastService,
    private cacheService: RequestCachingService,
    private analyticService: AnalyticsService,
    public alertCtrl: AlertController
  ) {
    this.transphormer = JSON.parse(window.localStorage.getItem('transphormer'));
    this.minDate = moment(this.transphormer.created_at);
  }

  ngOnInit() {
    this.actingDate = moment();
    this.today = moment();
    return this.initWorkout(this.today.toDate());
  }

  private getTotalSetsForExercise(exercise: WorkoutExercise): number {
    let number = 0;

    this.workoutSession.workout.exercise_groups.forEach((group) => {
      const exerciseInstances = group.exercises.filter((e) => {
        return e.id === exercise.id;
      });
      if (exerciseInstances.length > 0) {
        number += ((group.total_sets || 1) * (exercise.total_sets || 1));
      }
    });

    return number;
  }

  public async openTrackingModal(exercise: WorkoutExercise) {
    this.canLeaveAndroidBack = false;
    const exerciseData = this.getWorkoutExerciseData(exercise);

    const trackingModal = await this.modal.create({
      component: TrackerComponent,
      backdropDismiss: false,
      componentProps: {
        workoutData: exerciseData.workout_info,
        exercise,
      }
    });

    await trackingModal.present();
    const trackingResult = await trackingModal.onDidDismiss();
    this.canLeaveAndroidBack = true;

    if (trackingResult.data !== null) {
      exerciseData.logged_on = moment().format('YYYY-M-D');
      exerciseData.workout_info = trackingResult.data;
      this.saveWorkoutExerciseData(exerciseData);
      return this.updateWorkoutData();
    }
  }

  public async openAddNote() {
    this.canLeaveAndroidBack = false;

    const notesModal = await this.modal.create({
      component: AddNoteComponent,
      backdropDismiss: false,
      componentProps: {
        notes: this.workoutSession.notes.notes,
      },
    });
    await notesModal.present();

    const notes = (await notesModal.onDidDismiss()).data;
    this.canLeaveAndroidBack = true;

    if (notes === null) {
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      await this.workoutService.updateWorkoutNote(
        this.workoutSession.id,
        notes
      );
      this.workoutSession.notes.notes = notes;

      this.toastSvc.flash('Workout notes updated.');
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
    return loader.dismiss();
  }

  /**
   * Initializes the workout session
   */
  public async initWorkout(date: Date) {
    const loader = await this.loadingCtrl.create({
      message: 'Getting workout...',
    });
    await loader.present();

    try {
      this.workoutSession = <WorkoutSession>(
        await this.workoutService.fetchWorkout(date)

      );

      this.setupWorkout();

      this.analyticService.logEvent(AnalyticEvents.ViewingWorkouts, {});

    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
      if ((<ErrorFormat>e).status === 404) {
        this.workoutSession = null;
      }
    } finally {
      loader.dismiss();
    }
  }

  public minSec(time: number): string {
    if (time === 0 || time === null) {
      return '';
    }

    const min = Math.floor(time / 60);
    let sec = (time % 60).toString();

    if (sec.length === 1) {
      sec = '0' + sec.toString();
    }

    return `${min}:${sec}`;
  }

  /**
   * Updates the workout data information through the service
   */
  protected async updateWorkoutData() {
    try {
      const workout = <WorkoutSession>await this.workoutService.updateWorkoutExercise(this.workoutSession);
      this.workoutSession.session_exercises = workout.session_exercises;
      this.cacheService.clearKey(WorkoutsService.Url('workouts'), 'GET');
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  /**
   * Retrieves the workouts data based on exercise
   * @param exercise
   */
  private getWorkoutExerciseData(
    exercise: WorkoutExercise
  ): WorkoutExerciseData {
    const index = this.workoutSession.workout_data.findIndex(
      workoutExercise =>
        workoutExercise.exercise_id === exercise.exercise.id
    );

    let exerciseData: WorkoutExerciseData;
    if (index <= -1) {
      exerciseData = <WorkoutExerciseData>{
        exercise_id: exercise.exercise.id,
        exercise_group_id: exercise.id,
        workout_session_id: this.workoutSession.id,
        workout_info: this.createWorkoutInfo(
          exercise.record_type,
          this.getTotalSetsForExercise(exercise),
        ),
        logged_on: moment().format('YYYY-M-D'),
      };
      this.workoutSession.workout_data.push(exerciseData);
    } else {
      exerciseData = this.workoutSession.workout_data[index];
      exerciseData.workout_info = this.createWorkoutInfo(exercise.record_type, this.getTotalSetsForExercise(exercise));
    }

    return this.mergeSessionExerciseToWorkoutInfo(exerciseData, this.workoutSession.session_exercises);
  }

  public complete() {
    this.workoutSession.completed = !this.workoutSession.completed;
    return this.updateWorkoutData();
  }

  /**
   * Saves the workout data to the main workoutSession variable
   * @param exerciseData
   */
  private saveWorkoutExerciseData(exerciseData: WorkoutExerciseData) {
    const index = this.workoutSession.workout_data.findIndex(
      workoutExercise =>
        workoutExercise.exercise_id === exerciseData.exercise_id
    );

    this.workoutSession.workout_data[index] = exerciseData;
  }

  private createWorkoutInfo(
    recordType: number,
    loopCount: number | null
  ): WorkoutInfo[] {
    if (recordType === 1 && !loopCount) {
      loopCount = 1;
    }

    if (!loopCount) {
      return [];
    }

    const workouts: WorkoutInfo[] = [];
    for (let i = 1; i <= loopCount; i++) {
      workouts.push({
        weight: null,
        reps: null,
      });
    }

    return workouts;
  }

  public showStatsIcon(exercise: WorkoutExercise): boolean {
    return exercise.record_type === 1
      || exercise.record_type === 2;
  }

  public async workoutsInfo() {
    this.analyticService.logEvent(AnalyticEvents.WorkoutHelp, {});
    this.canLeaveAndroidBack = true;

    const workoutInfoModal = await this.modal.create({
      component: WorkoutsInfoComponent,
      backdropDismiss: false,
    });
    await workoutInfoModal.present();

    await workoutInfoModal.onDidDismiss();
    this.canLeaveAndroidBack = true;
  }

  /**
   * Handler to check date change events from week tab
   *
   * @param date
   */
  public onDateChange(date: Date) {
    this.canEdit = true;
    this.actingDate = moment(date);
    this.canEdit = (new Date()) < date;
    this.initWorkout(date);
  }

  /**
   * Merge new/existing workout session exercise information to workout info
   * @param exerciseData
   * @param workoutSessionExercises
   */
  private mergeSessionExerciseToWorkoutInfo(exerciseData: WorkoutExerciseData, workoutSessionExercises: WorkoutSessionExercise[])
    : WorkoutExerciseData {

    let set = 0;

    const workoutSessionExercise = workoutSessionExercises.filter(exercise =>
      exercise.exercise_group_id === exerciseData.exercise_group_id && exercise.exercise_id === exerciseData.exercise_id
    );

    exerciseData.workout_info = exerciseData.workout_info.map((workoutInfo) => {
      if (workoutSessionExercise[set]) {
        workoutInfo = {
          reps: workoutSessionExercise[set].reps,
          weight: workoutSessionExercise[set].weight,
        };
      }

      set++;
      return workoutInfo;
    });
    return exerciseData;
  }

  /**
   * Switch to home workout training for the day
   */
  public async switchToHomeWorkout() {

    // opening alert with training home workouts options as inputs
    const alert = await this.alertCtrl.create({
      header: 'Home Workout',
      message: 'Want to swap this regular workout for an at-home workout? Choose an option to continue.',
      inputs: TrainingHomeWorkouts.map(hw => {
        return {
          name: hw.name,
          placeholder: hw.name,
          type: 'radio',
          value: hw.value,
          label: hw.name
        };
      }) as AlertInput[],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Switch',
        role: 'go'
      }]
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result && result.role === 'go') {

      const loader = await this.loadingCtrl.create({
        message: 'Getting workout...'
      });
      await loader.present();

      try {
        this.workoutSession = <WorkoutSession> await this.workoutService.switchToHomeWorkout(this.workoutSession, true, result.data.values);
        this.setupWorkout();
      } catch (e) {
        this.toastSvc.flash(this.errorService.firstError(e));
      } finally {
        loader.dismiss();
      }
    }
  }

  /**
   * Setup fetched workout object
   */
  private setupWorkout() {
    if (!this.workoutSession.notes) {
      this.workoutSession.notes = <WorkoutNote>{
        notes: '',
      };
    }

    this.workoutSession.workout.exercise_groups = this.workoutSession.workout.exercise_groups.map(
      group => {
        if (group.group_time === 0 || group.group_time === null) {
          if (group.repeat === 4 || group.repeat === 3 || (group.repeat === 1 && group.group_time !== null)) {
            // Do nothing, the time is correct.
          } else if (group.repeat === 2 || (group.repeat === 1 && group.group_time === null)) {
            group.group_time = group.exercises.reduce((accumulator, currentValue: WorkoutExercise) => {
              if (currentValue.time_period) {
                return accumulator + currentValue.time_period;
              } else {
                return accumulator;
              }
            }, 0);
          }
          if (group.total_sets !== null) {
            group.group_time *= group.total_sets;
          }
        }
        return group;
      });
    this.workoutSession.workout_data = this.workoutSession.workout_data || [];
    this.workoutSession.workout_data = this.workoutSession.workout_data
      .map(workoutData => this.mergeSessionExerciseToWorkoutInfo(workoutData, this.workoutSession.session_exercises));
  }

  /**
   * Reverting back to gym based workout
   */
  public async revertToGymWorkout() {
    const loader = await this.loadingCtrl.create({
      message: 'Getting workout...'
    });
    await loader.present();

    try {
      this.workoutSession = <WorkoutSession>await this.workoutService.switchToHomeWorkout(this.workoutSession, false);
      this.setupWorkout();
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }

  }
}
