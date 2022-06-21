import { Component, OnInit, Input } from '@angular/core';
import {
  WorkoutSession,
} from '../../services/workouts/workouts.service';
import * as _ from 'lodash';
import * as moment from 'moment';

interface ExDisplay { // One Exercise Display Format
  exnote?: string; // notable column value
  exname?: string; // exercise name
  results?: string;
  // exlongnote: boolean; // true if reps and weight of workout_data is set
}

interface ExgroupDisplay { // Exercise Group Display Format
  name: string; // Workout name
  exercises: Array<ExDisplay>; // Exercise array
}

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
})
export class WorkoutComponent implements OnInit {

  @Input()
  public sessionWorkout: WorkoutSession;

  public note: string;
  public exerciseGroups: Array<any> = [];
  public sessionDay: string;
  public restDay: number;
  public noteExist: boolean;
  public emptyWorkout: boolean;

  public weekDay: Array<string> = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor() { }

  ngOnInit() {
    this.emptyWorkout = false;
    this.restDay = 0;
    this.noteExist = true;

    if (this.sessionWorkout.notes) {
      this.note = this.sessionWorkout.notes.notes;
    }
    if (this.sessionWorkout.notes === null || this.sessionWorkout.notes.notes === '') {
      this.noteExist = false;
    }

    this.restDay = this.sessionWorkout.workout.is_rest_day;
    this.sessionDay = this.weekDay[this.sessionWorkout.workout.day];

    if (this.sessionWorkout.workout.exercise_groups === null ||
        this.sessionWorkout.workout.exercise_groups === undefined ||
        this.sessionWorkout.workout.exercise_groups.length === 0 ) {
      this.emptyWorkout = true;
    } else {

      this.sessionWorkout.workout.exercise_groups.forEach(exGroup => {
        const oneGroup = <ExgroupDisplay> {
          name: exGroup.name,
          exercises: []
        };
        exGroup.exercises.forEach(exItem => {
          const oneWorkData = _.find(this.sessionWorkout.workout_data, {'exercise_group_id': exItem.id, 'exercise_id': exItem.exercise_id});
          const oneEx = <ExDisplay> {
            exnote: exItem.instructions,
            exname: exItem.name,
            results: '',
          };
          if (oneWorkData !== undefined) {
            const results = [];
            oneWorkData.workout_info.forEach(oneInfo => {
              if (oneInfo.weight !== null && oneInfo.reps !== null) {
                results.push(oneInfo.reps.toString() + ' x ' + oneInfo.weight.toString() + 'lbs');
              }
              if (oneInfo.weight !== null && oneInfo.reps === null) {
                results.push(oneInfo.weight.toString() + 'lbs');
              }
            });
            oneEx.results = results.join(', ');
          }
          oneGroup.exercises.push(oneEx);
        });
        this.exerciseGroups.push(oneGroup);
      });
    }
  }

  public get sessionDate() {
    return moment(this.sessionWorkout.workout_date).format('M/D');
  }

}
