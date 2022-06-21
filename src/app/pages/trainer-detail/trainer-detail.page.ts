import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Trainer, TrainerService } from '../../services/trainer/trainer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trainer-detail',
  templateUrl: './trainer-detail.page.html',
  styleUrls: ['./trainer-detail.page.scss'],
})
export class TrainerDetailPage implements OnInit {
  public trainer: Trainer;

  constructor(
    public errorService: ErrorsService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private trainerService: TrainerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.setupTrainer();
  }

  private checkHttp(url, prepend) {
    if (url.indexOf('http') === -1) {
      return prepend + url;
    }
    return url;
  }

  public visitFacebook(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.facebook.com/'));
  }

  public visitTwitter(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.twitter.com/'));
  }

  public visitPinterest(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.pinterest.com/'));
  }

  public visitInstagram(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.instagram.com/'));
  }

  public visitYoutube(url) {
    return this.visitUrl(
      this.checkHttp(url, 'https://www.youtube.com/results?search_query=')
    );
  }

  public visitLinkedIn(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.linkedin.com/in/'));
  }

  private visitUrl(url) {
    window.open(url, '_system', 'location=yes');
    return false;
  }

  protected async setupTrainer() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      this.trainer = <Trainer>(
        await this.trainerService.getTrainerByTransphormerId(
          parseFloat(this.route.snapshot.paramMap.get('id'))
        )
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
}
