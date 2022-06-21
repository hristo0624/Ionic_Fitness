import { WorkoutComponent } from './workout.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [WorkoutComponent],
  imports: [CommonModule, IonicModule],
  exports: [WorkoutComponent],
})
export class WorkoutModule {}
