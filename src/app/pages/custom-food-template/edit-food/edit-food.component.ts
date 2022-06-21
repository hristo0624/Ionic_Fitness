import { Component, HostListener, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FoodItem } from '../../../services/nutrition/nutrition.service';
import { CustomFoodTemplate, CustomFoodTemplateService } from '../../../services/custom-food-template/custom-food-template.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../services/errors/errors.service';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.scss']
})
export class EditFoodComponent implements OnInit {

  @Input()
  public set customFood(food: CustomFoodTemplate) {
    this.customFoodTemplate = food;

    this._foodItem = <FoodItem>{
      calories: food.calories,
      fats: food.fats,
      carbs: food.carbs,
      protein: food.protein,
      name: food.name,
      serving_size: {
        unit: food.serving_unit,
        amount: food.serving_amount,
        calories: food.calories,
        fats: food.fats,
        carbs: food.carbs,
        protein: food.protein,
      },
      amount_consumed: {
        unit: food.serving_unit,
        amount: 1,
      }
    };
  }

  public _foodItem: FoodItem;

  private customFoodTemplate: CustomFoodTemplate;

  constructor(
    private modal: ModalController,
    private loadingCtrl: LoadingController,
    private customFoodTemplateService: CustomFoodTemplateService,
    private toastService: ToastService,
    public errorService: ErrorsService
  ) {
  }

  ngOnInit() {
  }

  public closeModal() {
    this.modal.dismiss();
  }

  public async updateCustomFood(foodItem: FoodItem) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });
    await loader.present();

    try {
      const food = <CustomFoodTemplate>await this.customFoodTemplateService
        .updateCustomFood(this.customFoodTemplate.id, foodItem);

      this.modal.dismiss(food);
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
