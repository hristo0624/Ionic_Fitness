import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import { Transphormer } from '../../../services/authentication/authentication.service';
import {
  WorkoutSession,
  WorkoutNote,
  WorkoutExercise,
  WorkoutExerciseData,
  WorkoutSessionExercise
} from '../../../services/workouts/workouts.service';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { ErrorsService, ErrorFormat } from '../../../services/errors/errors.service';
import * as moment from 'moment';

@Component({
  selector: 'app-transphormer-workout',
  templateUrl: './transphormer-workout.page.html',
  styleUrls: ['./transphormer-workout.page.scss'],
})
export class TransphormerWorkoutPage implements OnInit {

  public transphormer: Transphormer;
  public twoWeeksWorkout: Array<WorkoutSession>;

  constructor(
    private trainerTransphormerService: TrainerTransphormerService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
  ) {
    this.transphormer = null;
    this.twoWeeksWorkout = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(pmap => this.loadTransphormerWorkout(+pmap.get('id')));
  }

  public get backHref() {
    return this.transphormer ? `/details/${this.transphormer.id}` : '/my-transphormers';
  }

  public async loadTransphormerWorkout(id: number) {
    const end = moment();
    const start = moment().subtract(14, 'day');

    try {
      await this.trainerTransphormerService.transphormerWorkouts(
        +id,
        start.format('YYYY-MM-DD'),
        end.format('YYYY-MM-DD')
      ).then((result: WorkoutSession[]) => {

        while (start.isSameOrBefore(end)) {
          const workout_date = start.format('YYYY-MM-DD');
          const found = result.find(i => i.workout_date === workout_date);
          if (!found) {
            result.push({
              id: 0,
              workout_id: null,
              transphormer_id: id,
              completed: false,
              switched_to_home: false,
              workout_data: [],
              workout_date,
              workout: {
                day: 2,
                id: null,
                week: 0,
                workout_date,
                training_id: null,
                exercise_groups: null,
              },
              session_exercises: [],
              notes: null,
            });
          }
          start.add(1, 'day');
        }

        this.twoWeeksWorkout = result.sort((a, b) => {
          return a.workout_date < b.workout_date ? -1 : 1;
        });
      });


      this.completeWorkoutDetailData();

    } catch (err) {
      this.toastSvc.flash(this.errorService.firstError(err));
      if ((<ErrorFormat>err).status === 404) {
        this.twoWeeksWorkout = null;
      }
    }
  }

  public async completeWorkoutDetailData() {
    if (this.twoWeeksWorkout.length === 0) {
      return;
    }

    this.twoWeeksWorkout.forEach((workoutSession) => {
      if (!workoutSession.notes) {
        workoutSession.notes = <WorkoutNote>{
          notes: '',
        };
      }

      workoutSession.workout_data = workoutSession.workout_data || [];
    });
  }

}
