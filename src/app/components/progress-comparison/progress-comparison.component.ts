import { Component, Input, OnInit } from '@angular/core';
import { CameraPhotos } from '../../services/camera/camera.service';
import { ZoomImgComponent } from '../zoom-img/zoom-img.component';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-progress-comparison',
  templateUrl: './progress-comparison.component.html',
  styleUrls: ['./progress-comparison.component.scss'],
})
export class ProgressComparisonComponent implements OnInit {

  @Input() public expanded: boolean;

  @Input()
  public before: CameraPhotos = {
    picture_front: null,
    picture_side: null,
    picture_back: null,
    transphormer_id: 0,
    created_at: '',
    id: 0,
    video_url: null,
    text: null,
  };

  @Input()
  public after: CameraPhotos = {
    picture_front: null,
    picture_side: null,
    picture_back: null,
    transphormer_id: 0,
    created_at: '',
    id: 0,
    video_url: null,
    text: null,
  };

  constructor(
    private modal: ModalController,
    private iab: InAppBrowser,
  ) {
  }

  ngOnInit() {
  }

  viewVideo(photos: CameraPhotos) {
    this.iab.create(photos.video_url, '_system', {location: 'yes'});
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
