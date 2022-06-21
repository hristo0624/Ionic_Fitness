import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WorkoutSessionExerciseHistory, WorkoutsService } from '../../../services/workouts/workouts.service';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.component.html',
  styleUrls: ['./workout-history.component.scss']
})
export class WorkoutHistoryComponent implements OnInit {

  @Input()
  public exerciseGroupId: number;

  @Input()
  public exerciseId: number;

  public loaded = false;

  public historyLogs: WorkoutSessionExerciseHistory[] = [];

  constructor(public modalCtrl: ModalController, public workoutService: WorkoutsService) {
  }

  async ngOnInit() {
    this.historyLogs = <WorkoutSessionExerciseHistory[]> await this.workoutService.exerciseHistory(this.exerciseId, this.exerciseGroupId);
    this.loaded = true;
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.close();
  }
}
