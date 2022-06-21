import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  Announcement,
  AnnouncementsService,
} from '../../services/announcements/announcements.service';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast-service/toast-service.service';

@Component({
  selector: 'app-trainer-announcements',
  templateUrl: './trainer-announcements.page.html',
  styleUrls: ['./trainer-announcements.page.scss'],
})
export class TrainerAnnouncementsPage implements OnInit {
  constructor(
    public errorService: ErrorsService,
    private announceService: AnnouncementsService,
    private toastSvc: ToastService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {
  }

  public announcements: Announcement[] = [];

  ngOnInit() {
    this.getAnnouncements();
  }

  private async getAnnouncements() {
    const loader = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loader.present();

    try {
      this.announcements = <Announcement[]>(
        await this.announceService.trainerAnnouncements()
      );
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public create() {
    this.navCtrl.navigateForward('/create-announcement');
  }
}
