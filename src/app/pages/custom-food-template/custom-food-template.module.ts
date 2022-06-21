import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CustomFoodTemplatePage } from './custom-food-template.page';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { AddModalComponent } from './add-modal/add-modal.component';
import { NutritionModule } from '../../components/nutrition/nutrition.module';
import { EditFoodComponent } from './edit-food/edit-food.component';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { EditMealComponent } from './edit-meal/edit-meal.component';

const routes: Routes = [
  {
    path: '',
    component: CustomFoodTemplatePage,
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SideMenuModule,
    NutritionModule,
    ReactiveFormsModule
  ],
  declarations: [CustomFoodTemplatePage, AddModalComponent, EditFoodComponent, EditMealComponent],
  entryComponents: [AddModalComponent, EditFoodComponent, EditMealComponent]
})
export class CustomFoodTemplatePageModule {
}
