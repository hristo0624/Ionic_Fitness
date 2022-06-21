import { Component, OnInit } from '@angular/core';
import { DisplayWeight } from '../../body-metrics/body-metrics.page';
import { Weight } from '../../../services/weights/weights.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ErrorsService } from '../../../services/errors/errors.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
})
export class MetricsPage implements OnInit {
  public weights: DisplayWeight[] = [];
  public Math = Math;

  constructor(public errorService: ErrorsService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private trainerTransphormerService: TrainerTransphormerService,
              private router: ActivatedRoute) {
  }

  ngOnInit() {
    this.setupWeights();
  }

  private async setupWeights() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      const weights = <Weight[]>await this.trainerTransphormerService
        .transphormerWeights(parseFloat(this.router.snapshot.paramMap.get('id')));
      const now = moment();

      this.weights = weights.reduce((carry: DisplayWeight[], weight): DisplayWeight[] => {
        const displayWeight = <DisplayWeight>weight;

        if (now.diff(<Moment>displayWeight.logged_on, 'days') === 0) {
          displayWeight.diffInDateAsReadable = 'Today';
        } else if (now.diff(<Moment>displayWeight.logged_on, 'weeks') !== 0) {
          displayWeight.diffInDateAsReadable = `${now.diff(
            <Moment>displayWeight.logged_on,
            'weeks',
          )} weeks ago`;
        } else {
          displayWeight.diffInDateAsReadable = `${now.diff(
            <Moment>displayWeight.logged_on,
            'days',
          )} days ago`;
        }

        carry.push(displayWeight);

        return carry;
      }, []);
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: this.errorService.firstError(e),
        duration: 3000,
      });
      await toast.present();
    } finally {
      loader.dismiss();
    }
  }

  public diffInWeight(currentIndex): number {
    if (currentIndex === this.weights.length - 1) {
      return 0;
    } else {
      return (-1) * (this.weights[currentIndex + 1].weight - this.weights[currentIndex].weight);
    }
  }

}
