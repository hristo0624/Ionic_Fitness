import { Component, HostListener, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CustomFoodTemplate, CustomFoodTemplateService } from '../../../services/custom-food-template/custom-food-template.service';
import { FoodItem } from '../../../services/nutrition/nutrition.service';
import { ErrorsService } from '../../../services/errors/errors.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent implements OnInit {

  constructor(
    private modal: ModalController,
    private customFoodTemplateService: CustomFoodTemplateService,
    private loadingCtrl: LoadingController,
    public errorService: ErrorsService,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
  }

  public closeModal() {
    this.modal.dismiss();
  }

  public async storeCustomFood(foodItem: FoodItem) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });

    await loader.present();

    try {
      const foodTemplate = <CustomFoodTemplate>await this.customFoodTemplateService.storeCustomFood(foodItem);
      this.modal.dismiss(foodTemplate);
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }

  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.closeModal();
  }

}
