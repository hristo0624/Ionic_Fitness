import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { Platform } from '@ionic/angular';
import { Trainer, TrainerService } from '../../services/trainer/trainer.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage {

  link: string;

  constructor(
    private clipboard: Clipboard,
    private toastSvc: ToastService,
    private trainerService: TrainerService,
    private platform: Platform,
  ) {
    const transphormer = JSON.parse(window.localStorage.getItem('transphormer'));
    this.trainerService.getTrainerByTransphormerId(transphormer.id)
      .then((trainerData: Trainer) => {
        this.link = trainerData.referral_url;
      });
  }

  public async copyLink() {
    let successful = true;
    if (!this.platform.is('cordova')) {
      const emailLink = document.querySelector('.email-link');
      const range = document.createRange();
      range.selectNode(emailLink);
      window.getSelection().addRange(range);
      try {
        // Now that we've selected the anchor text, execute the copy command
        successful = document.execCommand('copy');
      } catch (err) {
        successful = false;
      }
    } else {
      try {
        await this.clipboard.copy(this.link);
      } catch (e) {
        successful = false;
      }
    }
    if (successful) {
      this.toastSvc.flash('Link copied.');
    } else {
      this.toastSvc.flash('Unable to copy link.');
    }
  }

}
