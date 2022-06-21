import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { AnnouncementsService } from '../../services/announcements/announcements.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListingParams, PaginatedLinkedApplications, TrainerTransphormerService } from '../../services/trainer-transphormer/trainer-transphormer.service';
import { FilterComponent } from '../../components/filter/filter.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.page.html',
  styleUrls: ['./create-announcement.page.scss'],
})
export class CreateAnnouncementPage implements OnInit {

  public totalTransphormers = 0;
  public filteredTransphormers = 0;
  public isFiltering = false;

  public filterValues: ListingParams = {
    activeDays: '',
    uploadDays: '',
    haveNotUploadDays: '',
    joinedDays: '',
    name: '',
    customer_for_life: '',
    is_premium: '',
    not_messaged_in: ''
  };

  public form: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private announcementService: AnnouncementsService,
    private toastService: ToastService,
    private navCtrl: NavController,
    public errorService: ErrorsService,
    private trainerTransphormerService: TrainerTransphormerService,
    public modalCtrl: ModalController,
    public router: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      heading: new FormControl('', [Validators.required]),
      announcements: new FormControl('', [Validators.required])
    });

    for (let [variable, value] of Object.entries(this.router.snapshot.queryParams)) {
      if (this.filterValues.hasOwnProperty(variable)) {
        this.filterValues[variable] = value;

        if (variable === 'customer_for_life' || variable === 'is_premium') {
         value = value === 'true' ? true : value;
         value = value === 'false' ? false : value;
          this.filterValues[variable] = value;
        }
      }
    }

    this.setupTransphormersListing();
    this.filterListing();
  }

  public async submit() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {

      await this.announcementService.createAnnouncements(
        this.form.get('heading').value,
        this.form.get('announcements').value,
        this.filterValues
      );
      this.toastService.flash('Announcement created successfully');
      this.form.reset();
      this.form.markAsPristine();

    } catch (e) {
      console.log(e);
      this.toastService.flash(this.errorService.firstError(e));

    } finally {
      loader.dismiss();
    }
  }

  public async setupTransphormersListing() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait',
    });
    await loader.present();

    try {
      const result = <PaginatedLinkedApplications>(
        await this.trainerTransphormerService.transphormers(<ListingParams>{}, 1, 1)
      );

      this.totalTransphormers = result.total;

    } catch (e) {
      await this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public async filterListing() {
    this.isFiltering = true;
    this.filteredTransphormers = null;

    try {
      const result = <PaginatedLinkedApplications>(
        await this.trainerTransphormerService.transphormers(this.filterValues, 1, 1)
      );

      this.filteredTransphormers = result.total;

    } catch (e) {
      await this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.isFiltering = false;
    }
  }

  public cancel() {
    this.navCtrl.back();
  }

  public async openFilterModal() {
    const filterModal = await this.modalCtrl.create({
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
      this.filterListing();
    }
  }

}
