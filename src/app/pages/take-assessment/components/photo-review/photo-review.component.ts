import { Component, OnInit } from '@angular/core';
import { AssessmentStateService } from '../../services/assessment-state/assessment-state.service';
import { LoadingController, NavController } from '@ionic/angular';
import { CameraPhotos, CameraService } from '../../../../services/camera/camera.service';
import { ToastService } from '../../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../../services/errors/errors.service';
import * as moment from 'moment';

@Component({
  selector: 'app-photo-review',
  templateUrl: './photo-review.component.html',
  styleUrls: ['./photo-review.component.scss'],
})
export class PhotoReviewComponent implements OnInit {

  /**
   * List of recent photos in last 7 days
   */
  public photos: CameraPhotos[] = [];

  /**
   * Currently selected photo
   */
  public selectedPhoto: CameraPhotos | null = null;

  public loading = false;
  public hasRecentPhotos = false;

  constructor(
    public state: AssessmentStateService,
    public navCtrl: NavController,
    public cameraService: CameraService,
    public loadingCtrl: LoadingController,
    public toastService: ToastService,
    public errorService: ErrorsService
  ) {
  }

  public ngOnInit(): void {
    this.fetchRecentPhotos();
    if (this.state.photo) {
      this.selectedPhoto = this.state.photo;
    }
  }

  /**
   * Fetch recent 7 days photo
   */
  public async fetchRecentPhotos() {
    this.loading = true;

    const afterDate = moment().subtract(7, 'days')
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .format('YYYY-MM-DD hh:mm:ss');

    try {
      this.photos = <CameraPhotos[]>await this.cameraService.images({afterDate});
      const mostRecentPhoto = this.latestApplicablePhoto(this.photos);
      if (mostRecentPhoto) {
        this.hasRecentPhotos = true;
        this.selectPhoto(mostRecentPhoto);
      }
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    }

    this.loading = false;
  }


  /**
   * Redirect to page to take new photo
   */
  public takeNewPhoto() {
    const data = {
      useRecentPhoto: true
    };

    const redirectBackUrl = encodeURIComponent(`/take-assessment?useExisting=${JSON.stringify(data)}`);
    this.navCtrl.navigateRoot(`/camera?hideExtraFields=true&returnOnComplete=${redirectBackUrl}`);
  }

  /**
   * Select photo for state
   * @param photo
   */
  public selectPhoto(photo: CameraPhotos) {
    this.selectedPhoto = photo;
    this.state.setPhoto(this.selectedPhoto);
  }

  /**
   * Go to summary page
   */
  public jumpToSummary() {
    this.navCtrl.navigateRoot('/take-assessment/summary', {
      animated: true,
      animationDirection: 'forward'
    });
  }


  public latestApplicablePhoto(photos: CameraPhotos[]) {
    if (photos.length === 0) {
      return null;
    }
    const sorted = photos
      .sort((a, b) => {
        return a.id > b.id ? -1 : 1;
      })
      .filter((v) => {
        return moment(v.created_at).isAfter(moment().subtract(45, 'day'));
      });
    return sorted.length > 0 ? sorted[0] : null;
  }

}
