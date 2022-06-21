import { HeightModule } from './../../components/height/height.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProfilePagePage } from './profile-page.page';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { AppComponentsModule } from '../../components/common-components.module';
import { NutritionModule } from '../../components/nutrition/nutrition.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePagePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HeightModule,
    AppComponentsModule,
    SideMenuModule,
    NutritionModule
  ],
  declarations: [ProfilePagePage]
})
export class ProfilePagePageModule {}
