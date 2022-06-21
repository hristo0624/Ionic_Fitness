import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssessmentsPage } from './assessments.page';
import { AppComponentsModule } from '../../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: AssessmentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AppComponentsModule
  ],
  declarations: [AssessmentsPage]
})
export class AssessmentsPageModule {}
