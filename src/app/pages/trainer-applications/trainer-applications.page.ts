import { Component, OnInit } from '@angular/core';
import {
  LinkApplication,
  TrainerTransphormerLinkService,
} from '../../services/trainer-transphormer-link/trainer-transphormer-link.service';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  ActionSheetController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-trainer-applications',
  templateUrl: './trainer-applications.page.html',
  styleUrls: ['./trainer-applications.page.scss'],
})
export class TrainerApplicationsPage implements OnInit {
  public applications: LinkApplication[] = [];

  constructor(
    public errorService: ErrorsService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private trainerApplicationService: TrainerTransphormerLinkService,
    private actionSheetCtrl: ActionSheetController
  ) {
  }

  ngOnInit() {
    this.setupApplications();
  }

  private async setupApplications() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      this.applications = <LinkApplication[]>(
        await this.trainerApplicationService.trainerApplications()
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
  }

  public async acceptApplication(application: LinkApplication) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      await this.trainerApplicationService.acceptStatus(application.id);
      application.status = 'accepted';
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

  public async deleteApplication(application: LinkApplication) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      await this.trainerApplicationService.destroyLink(application.id);
      const index = this.applications.findIndex(
        existingApplication => application.id === existingApplication.id
      );
      this.applications.splice(index, 1);
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

  public async selectionActions() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Accept All',
          icon: 'checkmark',
          handler: () => {
            this.acceptAll();
          },
        },
        {
          text: 'Decline All',
          icon: 'trash',
          handler: () => {
            this.declineAll();
          },
        },
        {
          text: 'Cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  private async acceptAll() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      const ids = this.applications.map(application => application.id);
      await this.trainerApplicationService.batchAcceptStatus(ids);
      this.applications.forEach(application => {
        application.status = 'accepted';
      });
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

  private async declineAll() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      const ids = this.applications.map(application => application.id);
      await this.trainerApplicationService.batchDeleteStatus(ids);
      this.applications = [];
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
}
