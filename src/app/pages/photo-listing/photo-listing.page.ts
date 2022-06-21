import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CameraPhotos } from '../../services/camera/camera.service';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  LoadingController,
  ToastController,
  ActionSheetController,
  NavController,
  ModalController,
} from '@ionic/angular';
import { CameraService } from '../../services/camera/camera.service';
import * as moment from 'moment';
import { ZoomImgComponent } from '../../components/zoom-img/zoom-img.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-photo-listing',
  templateUrl: './photo-listing.page.html',
  styleUrls: ['./photo-listing.page.scss'],
})
export class PhotoListingPage implements OnInit {
  public images: CameraPhotos[] = [];
  public allImages: CameraPhotos[] = [];
  public latestImage: CameraPhotos;

  constructor(
    public errorHandler: ErrorsService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private cameraService: CameraService,
    private actionCtrl: ActionSheetController,
    private navCtrl: NavController,
    private modal: ModalController,
    private changeDetector: ChangeDetectorRef
  ) {
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
      this.allImages = <CameraPhotos[]>await this.cameraService.images();
      this.images = cloneDeep(this.allImages);
      this.latestImage = this.images[0];
      this.images.splice(0, 1);
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: this.errorHandler.firstError(e),
        duration: 3000,
      });
      await toast.present();
    } finally {
      loader.dismiss();
    }
  }

  public async photoListingAction() {
    const actionSheet = await this.actionCtrl.create({
      buttons: [
        {
          text: 'Reverse Order',
          icon: 'funnel',
          handler: () => {
            this.images = this.images.reverse();
            this.changeDetector.detectChanges();
          },
        },
        {
          text: 'Take new photos',
          icon: 'camera',
          handler: () => {
            this.navCtrl.navigateRoot('camera', {
              animated: true,
              animationDirection: 'forward'
            });
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

  public formatImage(date: string): string {
    return moment(date, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do, YYYY');
  }

  public async openZoomImg(imageSource: string) {
    const myModal = await this.modal.create({
      component: ZoomImgComponent,
      backdropDismiss: false,
      componentProps: {
        imgSource: imageSource
      },
    });
    await myModal.present();
  }
}
