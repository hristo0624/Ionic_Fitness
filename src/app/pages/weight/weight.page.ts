import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { Weight, WeightsService } from '../../services/weights/weights.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { OnboardingService } from '../../services/onboarding/onboarding.service';
import { CustomMacroService } from '../../services/custom-macro/custom-macro.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.page.html',
  styleUrls: ['./weight.page.scss'],
})
export class WeightPage implements OnInit {
  public latestWeight: Weight | null;

  public form: FormGroup;

  public wasAddedToday = false;

  constructor(
    public errorService: ErrorsService,
    private weightService: WeightsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private cacheService: RequestCachingService,
    private toastService: ToastService,
    public onboarding: OnboardingService,
    public customMacroService: CustomMacroService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      weight: new FormControl('', [
        Validators.required,
        Validators.max(600),
        Validators.min(60),
      ]),
    });

    this.form.get('weight').valueChanges.subscribe(value => {
      this.roundOffWeight(value);
    });

    this.fetchLatestWeight();
  }

  public get latestWeightDate() {
    if (!this.latestWeight) {
      return 'No weight logged yet!';
    }

    return (this.latestWeight.logged_on as Moment).local().format('YYYY-MM-DD h:mm a');
  }

  /**
   * Setups the latest weight
   */
  private async fetchLatestWeight() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });

    await loader.present();

    try {
      this.latestWeight = <Weight | null>await this.weightService.latestWeight();
      this.checkWasLoggedToday();

    } catch (e) {
      console.log(e);
      await this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public async storeWeight() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });

    await loader.present();

    try {
      if (this.wasAddedToday) {
        await this.editExistingWeight();
      } else {
        await this.storeNewWeight();
      }

      this.onboarding.fetchOnBoard();
      this.customMacroService.notifyToUpdateMacro(this.latestWeight.weight);
      this.navCtrl.navigateRoot('body-metrics');
      this.analyticService.logEvent(AnalyticEvents.AddingWeightIn);

    } catch (e) {
      await this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  /**
   * Rounding off the weight value to prevent decimal places.
   * @todo check why number pipe is not rendering updated values on view (could be a bug or something is missing).
   * @param value
   */
  private roundOffWeight(value: any) {
    value = parseFloat(value);
    if (!isNaN(value)) {
      this.form.get('weight').setValue(Math.round(value), {
        emitEvent: false
      });
    }
  }

  /**
   * Stores new weight in the system
   */
  protected async storeNewWeight() {
    this.latestWeight = <Weight>await this.weightService.saveWeight(this.form.get('weight').value);
    const toast = await this.toastCtrl.create({
      message: 'Weight logged successfully',
      duration: 3000,
    });
    this.cacheService.clearAll();
    await toast.present();
  }

  /**
   * Edit existing weight
   */
  protected async editExistingWeight() {
    this.latestWeight = <Weight>await this.weightService.updateWeight(this.latestWeight.id, this.form.get('weight').value);
    const toast = await this.toastCtrl.create({
      message: 'Weight Updated successfully',
      duration: 3000,
    });
    this.cacheService.clearAll();
    await toast.present();
  }

  /**
   * Setup various checks which will indicate the latest weight log was added the same day.
   */
  public checkWasLoggedToday() {
    if (this.latestWeight === null) {
      this.wasAddedToday = false;
    } else {
      const lowerBoundTime = moment().set('hour', 0)
        .set('minute', 0)
        .set('second', 0);

      const upperBoundTime = moment().set('hour', 23)
        .set('minute', 59)
        .set('second', 59);

      this.wasAddedToday = (this.latestWeight.logged_on as Moment).isBetween(lowerBoundTime, upperBoundTime);
    }
  }

  /**
   * Delete latest record
   */
  public async deleteRecord() {
    this.navCtrl.navigateBack('/body-metrics');
  }
}
