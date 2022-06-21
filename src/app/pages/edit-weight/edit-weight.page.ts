import { Component, OnInit } from '@angular/core';
import { Weight, WeightsService } from '../../services/weights/weights.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { ActivatedRoute } from '@angular/router';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';

@Component({
  selector: 'app-edit-weight',
  templateUrl: './edit-weight.page.html',
  styleUrls: ['./edit-weight.page.scss'],
})
export class EditWeightPage implements OnInit {

  public weight: Weight;
  public isConfirmingDelete = false;

  public form: FormGroup;

  constructor(
    private navCtrl: NavController,
    private toastService: ToastService,
    private weightService: WeightsService,
    private loadingCtrl: LoadingController,
    public errorService: ErrorsService,
    private route: ActivatedRoute,
    private cacheService: RequestCachingService
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

    this.fetchWeight();
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

  public close() {
    this.navCtrl.navigateBack('/body-metrics');
  }

  /**
   * Update the record with new weight value
   */
  public async updateWeight() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });
    await loader.present();

    try {
      this.weight = <Weight>await this.weightService.updateWeight(this.weight.id, this.form.get('weight').value);
      this.cacheService.clearAll();
      this.toastService.flash('Weigh in updated successfully');
      this.navCtrl.navigateRoot('/body-metrics');
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  /**
   * Delete the weight log entry
   */
  public async deleteWeight() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });
    await loader.present();

    try {
      this.weight = <Weight>await this.weightService.deleteWeight(this.weight.id);
      this.cacheService.clearAll();
      this.toastService.flash('Weigh in deleted successfully');
      this.navCtrl.navigateRoot('/body-metrics');
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  /**
   * Fetch original content
   */
  private async fetchWeight() {
    const weightId = this.route.snapshot.params.id;

    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });

    await loader.present();

    try {
      this.weight = <Weight>await this.weightService.getWeight(weightId);
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

}
