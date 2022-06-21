import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { ExerciseService } from '../../services/excercise/exercise.service';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from '../../services/workouts/workouts.service';

@Component({
  selector: 'app-exercise-view',
  templateUrl: './exercise-view.page.html',
  styleUrls: ['./exercise-view.page.scss'],
})
export class ExerciseViewPage implements OnInit {
  public exercise: Exercise;

  constructor(
    public errorService: ErrorsService,
    private exerciseService: ExerciseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private routing: ActivatedRoute,
    private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.getExercise();
  }

  private async getExercise() {
    await this.routing.params.subscribe(async params => {
      const loader = await this.loadingCtrl.create({
        message: 'Please wait ...',
      });
      await loader.present();

      try {
        this.exercise = <Exercise>(
          await this.exerciseService.getExercise(params.id)
        );
      } catch (e) {
        const toast = await this.toastCtrl.create({
          message: this.errorService.firstError(e),
          duration: 3000,
        });
        await toast.present();
      } finally {
        loader.dismiss();
      }
    });
  }

  public goToAlternateExercise(id) {
    this.navCtrl.navigateForward(`/exercises/${id}`);
  }
}
