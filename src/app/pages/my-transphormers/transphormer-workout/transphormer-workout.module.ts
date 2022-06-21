import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransphormerWorkoutPage } from './transphormer-workout.page';
import { WorkoutModule } from '../../../components/workout/workout.module';

const routes: Routes = [
  {
    path: '',
    component: TransphormerWorkoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransphormerWorkoutPage]
})
export class TransphormerWorkoutPageModule {}
