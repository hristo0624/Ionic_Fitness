import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NutritionDetailPage } from './nutrition-detail.page';

const routes: Routes = [
  {
    path: '',
    component: NutritionDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NutritionDetailPage]
})
export class NutritionDetailPageModule {}
