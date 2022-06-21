import { Component, HostListener, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WorkoutExercise } from '../../../services/workouts/workouts.service';

interface WeightAndReps {
  weight: number;
  reps: number | null;
}

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent {

  @Input()
  public workoutData: WeightAndReps[];

  @Input()
  public exercise: WorkoutExercise;

  constructor(public modalCtrl: ModalController) {
  }

  public updateAndClose() {
    this.modalCtrl.dismiss(this.workoutData);
  }

  public closeModal() {
    this.modalCtrl.dismiss(null);
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.closeModal();
  }
}
