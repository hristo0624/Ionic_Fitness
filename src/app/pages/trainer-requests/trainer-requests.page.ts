import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  LinkApplication,
  TrainerTransphormerLinkService,
} from '../../services/trainer-transphormer-link/trainer-transphormer-link.service';
import { Transphormer } from '../../services/authentication/authentication.service';
import { Trainer, TrainerService } from '../../services/trainer/trainer.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
import { ToastService } from '../../services/toast-service/toast-service.service';

@Component({
  selector: 'app-trainer-requests',
  templateUrl: './trainer-requests.page.html',
  styleUrls: ['./trainer-requests.page.scss'],
})
export class TrainerRequestsPage implements OnInit {
  public application: LinkApplication | null = null;

  public hasTrainer = false;
  public checkComplete = false;
  public canMessage = false;
  public trainer: Trainer;

  constructor(
    private loadingCtrl: LoadingController,
    private linkService: TrainerTransphormerLinkService,
    private trainerService: TrainerService,
    private alertCtrl: AlertController,
    public errorService: ErrorsService,
    private changeDetection: ChangeDetectorRef,
    private toastSvc: ToastService,
    private analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.checkApplicationStatus();
    this.analyticService.logEvent(AnalyticEvents.SearchingAdvisor, {});
  }

  protected async setupTrainer() {
    try {
      this.trainer = <Trainer>(
        await this.trainerService.getTrainerByTransphormerId(this.application.trainer.transphormer_id)
      );
    } catch (e) {
      await this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  protected async dropTrainer() {
    this.analyticService.logEvent(AnalyticEvents.DroppingAdvisor, {});
    const alert = await this.alertCtrl.create({
      header: 'Drop advisor?',
      message: 'Do you really want to leave this advisor?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeTrainer();
          },
        },
      ],
    });
    return await alert.present();
  }

  private async removeTrainer() {
    const loader = await this.loadingCtrl.create({
      message: 'One sec...',
    });
    await loader.present();

    try {
      await this.linkService.destroyLink(this.application.id);
      this.hasTrainer = false;
      this.canMessage = false;
    } catch (e) {
      await this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  private async checkApplicationStatus() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait...',
    });

    await loader.present();

    try {
      this.application = <LinkApplication>(
        await this.linkService.requestStatus()
      );
      this.hasTrainer = true;

      if (this.application.status === 'accepted') {
        this.canMessage = true;
        this.setupTrainer();
      }
    } catch (e) {
      if (e.status !== 404) {
        await this.toastSvc.flash(this.errorService.firstError(e));
      }
    } finally {
      loader.dismiss();
      this.checkComplete = true;
    }
  }

  public async newTrainerApplication(application: LinkApplication) {
    this.application = application;
    this.hasTrainer = true;
  }

  public removeApplicationStatus() {
    this.hasTrainer = false;
    this.application = null;
    this.changeDetection.detectChanges();
  }

  public get user(): Transphormer {
    return JSON.parse(window.localStorage.getItem('transphormer'));
  }
}
