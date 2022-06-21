import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FoodItem } from '../../../services/nutrition/nutrition.service';
import { MealTemplate, MealTemplatesService } from '../../../services/meal-templates/meal-templates.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../services/errors/errors.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-meal',
  templateUrl: './edit-meal.component.html',
  styleUrls: ['./edit-meal.component.scss'],
})
export class EditMealComponent implements OnInit {

  @Input()
  public set meal(meal: MealTemplate<FoodItem>) {
    this._meal = meal;
    this.setupForm();
    this.form.get('name').setValue(this._meal.name);
  }

  private _meal: MealTemplate<FoodItem>;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    public toastService: ToastService,
    public errorService: ErrorsService,
    public mealTemplateService: MealTemplatesService
  ) {
  }

  public form: FormGroup;

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    if (this.form) {
      return;
    }

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)])
    });
  }

  public close() {
    this.modalController.dismiss();
  }

  public async updateMeal() {
    const loader = await this.loadingController.create({
      message: 'Please wait ...'
    });

    await loader.present();

    try {
      const meal = <MealTemplate<FoodItem>>await this.mealTemplateService.update(this._meal.id, this.form.get('name').value);
      this.toastService.flash('Meal name updated successfully.');
      this.modalController.dismiss(meal);
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.close();
  }
}
