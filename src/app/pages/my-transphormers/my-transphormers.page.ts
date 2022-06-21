import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NavController,
  ModalController,
  LoadingController, IonContent, IonInfiniteScroll,
} from '@ionic/angular';
import { FilterComponent } from '../../components/filter/filter.component';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  TrainerTransphormerService,
  ListingParams, PaginatedLinkedApplications,
} from '../../services/trainer-transphormer/trainer-transphormer.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { Sex } from '../../services/onboarding/onboarding.service';
import { Transphormer } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-my-transphormers',
  templateUrl: './my-transphormers.page.html',
  styleUrls: ['./my-transphormers.page.scss'],
})
export class MyTransphormersPage implements OnInit {

  public transphormers: Transphormer[] = [];
  public totalTransphormers = 0;
  public totalFilteredTransphormers = 0;

  public SexValue = Sex;
  private page = 1;
  private lastPage = 1;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('messageContent') public messageContent: IonContent;

  public filterValues: ListingParams = <ListingParams>{
    activeDays: '',
    uploadDays: '',
    haveNotUploadDays: '',
    joinedDays: '',
    name: '',
    customer_for_life: '',
    is_premium: '',
    not_messaged_in: ''
  };

  public math = Math;

  constructor(
    public navCtrl: NavController,
    private modal: ModalController,
    public errorService: ErrorsService,
    private toastCtrl: ToastService,
    public loadingCtrl: LoadingController,
    private trainerTransphormerService: TrainerTransphormerService,
  ) {
  }

  ngOnInit() {
    this.setupTransphormersListing(true);
  }

  public async goToFilters() {
    const filterModal = await this.modal.create({
      component: FilterComponent,
      backdropDismiss: false,
      componentProps: {
        initialFormValue: this.filterValues,
      },
    });
    await filterModal.present();

    const data = (await filterModal.onDidDismiss()).data;

    if (data) {
      this.filterValues = data;
      this.setupTransphormersListing(false, true);
    }
  }

  public async goToDetails(transphormer: Transphormer) {
    this.navCtrl.navigateForward(`details/${transphormer.id}`);
  }

  public async setupTransphormersListing(updateTotal = false, reset = false) {
    let loader;
    if (this.page < 2) {
      loader = await this.loadingCtrl.create({
        message: 'Loading Transphormers...',
      });
      await loader.present();
    }

    try {
      const result = <PaginatedLinkedApplications>(
        await this.trainerTransphormerService.transphormers(this.filterValues, this.page)
      );

      if (reset) {
        this.transphormers = [];
        this.page = 1;
      }

      this.transphormers = this.transphormers.concat(result.data);

      if (updateTotal) {
        this.totalTransphormers = result.total;
      }

      this.totalFilteredTransphormers = result.total;
      this.page = result.current_page;
      this.lastPage = result.last_page;
      this.infiniteScroll.disabled  = this.page === this.lastPage;
    } catch (e) {
      await this.toastCtrl.flash(this.errorService.firstError(e));
    } finally {
      if (loader) {
        loader.dismiss();
      }
    }
  }

  public goToCreateAnnouncement() {
    let url = '/create-announcement?';
    for (const [variable, value] of Object.entries(this.filterValues)) {
      url = `${url}${variable}=${value}&`;
    }
    this.navCtrl.navigateForward(url);
  }

  public async listingEnd(event) {
    if (this.page < this.lastPage) {
      this.page++;
      await this.setupTransphormersListing(false);
      event.target.complete();
    }
  }
}
