import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TrainerRegistrationPage } from './trainer-registration.page';
import { LogoModule } from '../../components/logo/logo.module';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';

const routes: Routes = [
  {
    path: '',
    component: TrainerRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    LogoModule,
    SideMenuModule
  ],
  declarations: [TrainerRegistrationPage]
})
export class TrainerRegistrationPageModule {
}
