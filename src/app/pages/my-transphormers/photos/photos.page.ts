import { Component, OnInit } from '@angular/core';
import { CameraPhotos } from '../../../services/camera/camera.service';
import { ErrorsService } from '../../../services/errors/errors.service';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  public latestImage: CameraPhotos;
  public images: CameraPhotos[] = [];
  public allImages: CameraPhotos[] = [];
  public transphormerId: number;
  private showDetails = true;

  constructor(public errorService: ErrorsService,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private trainerTransphormerService: TrainerTransphormerService,
              private router: ActivatedRoute,
              private actionCtrl: ActionSheetController) {
  }

  ngOnInit() {
    this.setupImages();
  }

  private async setupImages() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait',
    });
    await loader.present();

    try {
      this.transphormerId = +this.router.snapshot.paramMap.get('id');
      this.allImages = <CameraPhotos[]>await this.trainerTransphormerService
        .transphormerPhotos(this.transphormerId);
      this.images = this.allImages.slice(0);
      this.latestImage = this.images[0];
      this.images.splice(0, 1);
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

  public formatImage(date: string): string {
    return moment(date, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do, YYYY');
  }

  public async photoListingAction() {
    const actionSheet = await this.actionCtrl.create({
      buttons: [
        {
          text: 'Reverse Order',
          icon: 'funnel',
          handler: () => {
            this.images = this.images.reverse();
          },
        },
        {
          text: this.showDetails ? 'Hide Details' : 'Show Details',
          icon: 'star',
          handler: () => {
            this.showDetails = !this.showDetails;
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}
