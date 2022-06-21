import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExerciseViewPage } from './exercise-view.page';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';

const routes: Routes = [
  {
    path: '',
    component: ExerciseViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SafeUrlModule
  ],
  declarations: [ExerciseViewPage]
})
export class ExerciseViewPageModule {
}
