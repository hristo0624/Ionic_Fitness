import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AddModalComponent } from './add-modal/add-modal.component';
import { CustomFoodTemplate, CustomFoodTemplateService } from '../../services/custom-food-template/custom-food-template.service';
import { EditFoodComponent } from './edit-food/edit-food.component';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { MealTemplate, MealTemplatesService } from '../../services/meal-templates/meal-templates.service';
import { FoodItem } from '../../services/nutrition/nutrition.service';
import { EditMealComponent } from './edit-meal/edit-meal.component';

interface ListItem {
  type: 'custom-food' | 'meal';
  item: CustomFoodTemplate | MealTemplate<FoodItem>;
}

@Component({
  selector: 'app-custom-food-template',
  templateUrl: './custom-food-template.page.html',
  styleUrls: ['./custom-food-template.page.scss'],
})
export class CustomFoodTemplatePage implements OnInit, CanLeaveRoute {

  public customFoods: CustomFoodTemplate[] = [];

  public mealTemplates: MealTemplate<FoodItem>[] = [];

  public list: ListItem[] = [];

  public canLeaveAndroidBack = true;

  constructor(
    private modalCtrl: ModalController,
    private customFoodTemplateService: CustomFoodTemplateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cacheService: RequestCachingService,
    private toastService: ToastService,
    public errorService: ErrorsService,
    private changeDetector: ChangeDetectorRef,
    public mealTemplateService: MealTemplatesService
  ) {
  }

  ngOnInit() {
    this.listFoodTemplates();
  }

  public async openAddCustomFoodModal() {
    const addModal = await this.modalCtrl.create({
      component: AddModalComponent,
      backdropDismiss: false
    });

    await addModal.present();

    const result = await addModal.onDidDismiss();

    if (result.data) {
      this.customFoods.push(result.data);
      this.cacheService.clearAll();
    }
  }

  public async listFoodTemplates() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });

    await loader.present();

    try {
      const customFoodRequest = this.customFoodTemplateService.listCustomFoods();
      const mealTemplateRequest = this.mealTemplateService.all();

      this.customFoods = <CustomFoodTemplate[]>await customFoodRequest;
      this.mealTemplates = <MealTemplate<FoodItem>[]>await mealTemplateRequest;
      this.createList();

    } catch (e) {
      console.log(e);
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public async openEditFoodModal(customFood: CustomFoodTemplate) {
    const editModal = await this.modalCtrl.create({
      component: EditFoodComponent,
      componentProps: {
        customFood
      },
      backdropDismiss: false
    });

    await editModal.present();

    const result = await editModal.onDidDismiss();

    if (result.data) {
      const index = this.customFoods.findIndex(food => food.id === customFood.id);
      this.customFoods[index] = result.data;
      this.cacheService.clearAll();
    }
  }

  public async removeTemplate(type: string, template: CustomFoodTemplate | MealTemplate<FoodItem>) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      buttons: [{
        text: 'Remove',
        role: 'success',
        cssClass: 'global-danger',
        handler: () => {
          if (type === 'custom-food') {
            this.destroyTemplate(<CustomFoodTemplate>template);
          } else {
            this.destroyMealTemplate(<MealTemplate<FoodItem>>template);
          }
        }
      }, {
        text: 'Cancel',
        role: 'success',
      }]
    });

    await alert.present();
  }

  private async destroyTemplate(template: CustomFoodTemplate) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });

    await loader.present();

    try {
      await this.customFoodTemplateService.deleteCustomFood(template.id);
      const index = this.customFoods.findIndex(food => food.id === template.id);
      this.customFoods.splice(index, 1);
      this.createList();
      this.cacheService.clearAll();
      this.changeDetector.detectChanges();
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
      console.log(e);
    } finally {
      loader.dismiss();
    }
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.canLeaveAndroidBack = false;
  }

  private createList() {
    this.list = [];
    this.list = this.list.concat(this.customFoods.map<ListItem>(item => {
      return {type: 'custom-food', item};
    })).concat(this.mealTemplates.map<ListItem>(item => {
      return {type: 'meal', item};
    }));

    this.list = this.list.sort((item1, item2) => item1.item.name.toUpperCase() >= item2.item.name.toUpperCase() ? 1 : -1);
  }

  public async destroyMealTemplate(template: MealTemplate<FoodItem>) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });

    await loader.present();
    try {
      await this.mealTemplateService.delete(template.id);
      this.mealTemplates.splice(this.mealTemplates.findIndex(food => food.id === template.id), 1);
      this.createList();
      this.changeDetector.detectChanges();
      this.cacheService.clearAll();
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public async openEditMealModal(meal: MealTemplate<FoodItem>) {
    const editModal = await this.modalCtrl.create({
      component: EditMealComponent,
      componentProps: {
        meal
      },
      backdropDismiss: false,
      cssClass: 'meal-template-name-modal'
    });

    await editModal.present();

    const result = await editModal.onDidDismiss();

    if (result.data) {
      const index = this.mealTemplates.findIndex(food => food.id === meal.id);
      this.mealTemplates[index] = result.data;
      this.createList();
      this.cacheService.clearAll();
    }
  }
}
