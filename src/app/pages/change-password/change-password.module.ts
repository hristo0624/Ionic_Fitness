import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChangePasswordPage } from './change-password.page';
import { LogoModule } from '../../components/logo/logo.module';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LogoModule,
    ReactiveFormsModule,
    SideMenuModule
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {
}
